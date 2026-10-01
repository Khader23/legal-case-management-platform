import { createRouter, createWebHistory } from 'vue-router'
import CasesView from '../views/CasesView.vue'
import CaseDetailsView from '../views/CaseDetailsView.vue'
import CreateCaseView from '../views/CreateCaseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/cases',
    },
    {
      path: '/cases',
      name: 'cases',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: CasesView,
    },
    {
      // creates new case form on the create case page 
      path: '/cases/new',
      name: 'create-case', 
      component: CreateCaseView,
    },
    {
      // specific case and :id reflects any cases, its dynamic and can be changed
      path: '/cases/:id',
      name: '/case-details', 
      component: CaseDetailsView,
    },
  ],
})

export default router
