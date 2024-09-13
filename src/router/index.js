import { createRouter, createWebHashHistory } from 'vue-router';


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
    path: '/questionnaire/v1/demo',
    name: 'questionnaireV1Demo',
    component: () => import('@/views/questionnaire/v1/demo.vue')
  },
  {
    path: '/questionnaire/v1/design/question',
    name: 'questionnaireV1DesignQuestion',
    component: () => import('@/views/questionnaire/v1/design/question.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/404.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
