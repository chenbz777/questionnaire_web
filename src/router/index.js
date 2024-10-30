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
    name: 'questionnaireV1Design',
    component: () => import('@/views/questionnaire/design/index.vue')
  },
  {
    path: '/questionnaire/answer',
    name: 'questionnaireV1Answer',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/readonly',
    name: 'questionnaireV1Readonly',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/answer/easy',
    name: 'questionnaireV1AnswerEasy',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/readonly/easy',
    name: 'questionnaireV1ReadonlyEasy',
    component: () => import('@/views/questionnaire/answer/index.vue')
  },
  {
    path: '/questionnaire/design/question',
    name: 'questionnaireV1DesignQuestion',
    component: () => import('@/views/questionnaire/design/question.vue')
  },
  {
    path: '/questionnaire/demo/design',
    name: 'questionnaireV1DemoDesign',
    component: () => import('@/views/questionnaire/demo/design.vue')
  },
  {
    path: '/questionnaire/demo/answer',
    name: 'questionnaireV1DemoAnswer',
    component: () => import('@/views/questionnaire/demo/answer.vue')
  },
  {
    path: '/questionnaire/demo/design/question',
    name: 'questionnaireV1DemoDesignQuestion',
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
