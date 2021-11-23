const { description } = require('../../package')

module.exports = {
  dest:'docs',
  base:'/documentacion-vue/',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Documentacion General !💻💻💻',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Documentacion 😄',
        link: '/guide/',
      },
      {
        text: 'Config 🚀',
        link: '/config/'
      },
      {
        text: 'Mi GitHub ! ❤️',
        link: 'https://github.com/sebarach'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Documentacion',
          collapsable: true,
          children: [
            '',
            'git-basico',
          ]
        },
        {
          title: 'Apuntes',
          collapsable: true,
          children: [
            '/guide/apuntes/',
            '/guide/apuntes/uai-sql',
          ]
        },
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
