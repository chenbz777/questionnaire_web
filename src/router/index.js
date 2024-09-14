import { createRouter, createWebHistory } from 'vue-router';
// createWebHashHistory

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/questionnaire/v1/design',
    name: 'questionnaireV1Design',
    component: () => import('@/views/questionnaire/v1/design/index.vue')
  },
  {
    path: '/questionnaire/v1/answer',
    name: 'questionnaireV1Answer',
    component: () => import('@/views/questionnaire/v1/answer/index.vue')
  },
  {
    path: '/questionnaire/v1/readonly',
    name: 'questionnaireV1Readonly',
    component: () => import('@/views/questionnaire/v1/answer/index.vue')
  },
  {
    path: '/questionnaire/v1/answer/easy',
    name: 'questionnaireV1AnswerEasy',
    component: () => import('@/views/questionnaire/v1/answer/index.vue')
  },
  {
    path: '/questionnaire/v1/readonly/easy',
    name: 'questionnaireV1ReadonlyEasy',
    component: () => import('@/views/questionnaire/v1/answer/index.vue')
  },
  {
    path: '/questionnaire/v1/design/question',
    name: 'questionnaireV1DesignQuestion',
    component: () => import('@/views/questionnaire/v1/design/question.vue')
  },
  {
    path: '/questionnaire/v1/demo/design',
    name: 'questionnaireV1DemoDesign',
    component: () => import('@/views/questionnaire/v1/demo/design.vue')
  },
  {
    path: '/questionnaire/v1/demo/answer',
    name: 'questionnaireV1DemoAnswer',
    component: () => import('@/views/questionnaire/v1/demo/answer.vue')
  },
  {
    path: '/questionnaire/v1/demo/design/question',
    name: 'questionnaireV1DemoDesignQuestion',
    component: () => import('@/views/questionnaire/v1/demo/designQuestion.vue')
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
