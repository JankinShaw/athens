(ns athens.router
  (:require
    [athens.db :as db]
    [athens.electron.db-picker :as db-picker]
    [athens.util :as util]
    #_[athens.views :as views]
    [day8.re-frame.tracing :refer-macros [fn-traced]]
    [posh.reagent :refer [pull]]
    [re-frame.core :as rf :refer [subscribe dispatch reg-sub reg-event-fx reg-fx]]
    [reitit.coercion.spec :as rss]
    [reitit.frontend :as rfe]
    [reitit.frontend.controllers :as rfc]
    [reitit.frontend.easy :as rfee]))


;; subs
(reg-sub
  :current-route
  (fn [db]
    (-> db :current-route)))


(reg-sub
  :current-route/uid
  (fn [db]
    (-> db :current-route :path-params :id)))


(reg-sub
  :current-route/name
  (fn [db]
    (-> db :current-route :data :name)))


;; events
(reg-event-fx
  :navigate
  (fn [{:keys [db]} [_ & route]]
    (let [db-id  (-> db db-picker/selected-db :id)
          new-db (if db-id
                   (assoc-in db [:athens/persist :db-picker/all-dbs db-id :current-route/uid] (-> route second :id))
                   db)]
      {:navigate! route
       :db        new-db})))


(reg-event-fx
  :navigated
  (fn [{:keys [db]} [_ new-match]]
    (let [old-match   (:current-route db)
          controllers (rfc/apply-controllers (:controllers old-match) new-match)
          uid (-> new-match :path-params :id)
          node (pull db/dsdb '[*] [:block/uid uid]) ; TODO make the page title query work when zoomed in on a block
          node-title (:node/title @node)
          route-name (-> new-match :data :name)
          home? (= route-name :home)
          html-title-prefix (cond
                              node-title node-title
                              (= route-name :pages) "All Pages"
                              home? "Daily Notes")
          html-title (if html-title-prefix
                       (str html-title-prefix " | Athens")
                       "Athens")
          today (util/get-day)]
      (set! (.-title js/document) html-title)
      {:db (-> db
               (assoc :current-route (assoc new-match :controllers controllers))
               (dissoc :merge-prompt))
       :timeout {:action :clear
                 :id :merge-prompt}
       :dispatch-n [(when home?
                      [:daily-note/ensure-day today])
                    (when-let [parent-uid (or uid (and home? (:uid today)))]
                      [:editing/first-child parent-uid])]})))


(reg-event-fx
  :restore-navigation
  (fn [{:keys [db]} _]
    (if-let [uid (-> db db-picker/selected-db :current-route/uid)]
      {:dispatch [:navigate :page {:id uid}]}
      {:dispatch [:navigate :home]})))


;; effects

(reg-fx
  :navigate!
  (fn-traced [route]
             (apply rfee/push-state route)))


;; router definition

(def routes
  ["/"
   ["" {:name :home}]
   ["settings" {:name :settings}]
   ["pages" {:name :pages}]
   ["page/:id" {:name :page}]
   ["graph" {:name :graph}]])


(def router
  (rfe/router
    routes
    {:data {:coercion rss/coercion}}))


(defn on-navigate
  [new-match]
  (when new-match
    (dispatch [:navigated new-match])))


(defn navigate
  [page]
  (dispatch [:navigate page]))


(defn nav-daily-notes
  "When user is already on a date node-page, clicking on daily notes goes to that date and allows scrolling."
  []
  (let [route-uid @(subscribe [:current-route/uid])]
    (if (util/is-daily-note route-uid)
      (dispatch [:daily-note/reset [route-uid]])
      (dispatch [:daily-note/reset []]))
    (navigate :home)))


(defn navigate-uid
  "Don't navigate if already on the page."
  ([uid]
   (let [[uid _embed-id]   (db/uid-and-embed-id uid)
         current-route-uid @(subscribe [:current-route/uid])]
     (when (not= current-route-uid uid)
       (dispatch [:navigate :page {:id uid}]))))
  ([uid e]
   (let [[uid _embed-id]   (db/uid-and-embed-id uid)
         shift             (.. e -shiftKey)]
     (if shift
       (do
         (.. js/window getSelection empty)
         (.. e preventDefault)
         (dispatch [:right-sidebar/open-item uid]))
       (navigate-uid uid)))))


(defn init-routes!
  []
  (prn "Initializing routes")
  (rfee/start!
    router
    on-navigate
    {:use-fragment true}))
