import { createRouter, createWebHistory } from 'vue-router';
// createWebHashHistory

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/questionnaire/design',
    name: 'questionnaireDesign',
    component: () => import('@/views/questionnaire/design/index.vue')
  },
  {
    path: '/questionnaire/answer',
    name: 'questionnaireAnswer',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/readonly',
    name: 'questionnaireReadonly',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/answer/easy',
    name: 'questionnaireAnswerEasy',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/readonly/easy',
    name: 'questionnaireReadonlyEasy',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/design/question',
    name: 'questionnaireDesignQuestion',
    component: () => import('@/views/questionnaire/design/question.vue')
  },
  {
    path: '/questionnaire/demo/design',
    name: 'questionnaireDemoDesign',
    component: () => import('@/views/questionnaire/demo/design.vue')
  },
  {
    path: '/questionnaire/demo/answer',
    name: 'questionnaireDemoAnswer',
    component: () => import('@/views/questionnaire/demo/answer.vue')
  },
  {
    path: '/questionnaire/demo/design/question',
    name: 'questionnaireDemoDesignQuestion',
    component: () => import('@/views/questionnaire/demo/designQuestion.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/404.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
