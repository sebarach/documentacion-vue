const { description } = require('../../package')

module.exports = {
  dest:'docs',
  base:'/documentacion-vue/',
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
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href:`/favicon.ico` }],
    ['script', {}, `
    (function(){

      var doc = document.documentElement;
      var w = window;
    
      var prevScroll = w.scrollY || doc.scrollTop;
      var curScroll;
      var direction = 0;
      var prevDirection = 0;
    
      var header = document.getElementById('site-header');
    
      var checkScroll = function() {
  
        curScroll = w.scrollY || doc.scrollTop;
        if (curScroll > prevScroll) { 
          //scrolled up
          direction = 2;
        }
        else if (curScroll < prevScroll) { 
          //scrolled down
          direction = 1;
        }
    
        if (direction !== prevDirection) {
          toggleHeader(direction, curScroll);
        }
        
        prevScroll = curScroll;
      };
    
      var toggleHeader = function(direction, curScroll) {
        if (direction === 2 && curScroll >= 100) { 
    
          //header.classList.add('hide');
          let element = document.getElementsByTagName('header')[0];
          element.setAttribute("hidden", "hidden");
          prevDirection = direction;
        }
        else if (direction === 1 && curScroll < 100) {
          let element = document.getElementsByTagName('header')[0];
          element.removeAttribute("hidden");
          prevDirection = direction;
        }
      };
      
      window.addEventListener('scroll', checkScroll);
      
    })();
    `]
  ],

  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    search: false,
    nav: [
      {
        text: 'PluralSight!📘📘',
        link: '/pluralsight/',
      },
      {
        text: 'SQL!📘📘',
        link: '/sqlserver/',
      },
      {
        text: 'JavaScript ! 💀💀💀',
        link: '/javascript/',
      },
      {
        text: 'Cuentas Departamento 💵💵💵',
        link: '/departamento/',
      },
      {
        text: 'Documentacion 😄',
        link: '/guide/',
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
            'datatable-js',
          ]
        },
        {
          title: 'Apuntes',
          collapsable: true,
          children: [
            '/guide/apuntes/',
            '/guide/apuntes/uai-sql',
            '/guide/apuntes/encochinamiento',
          ]
        },
      ],
      '/departamento/': [
        {
          title: 'General',
          collapsable: true,
          children: [
            // 'mayo2021',
            // 'junio2021',
            // 'julio2021',
            // 'agosto2021',
            // 'septiembre2021',
            // 'octubre2021',
            // 'noviembre2021',
            // 'diciembre2021',
            'enero2022',
            'febrero2022',
            'marzo2022',
            'abril2022',
            'mayo2022',
            'junio2022',
            'julio2022',
            'agosto2022',
            'septiembre2022',
            'octubre2022',
          ]
        },
        {
          title: 'Numero de Cuentas',
          collapsable: true,
          children: [
            '/departamento/num-cuentas/',
          ]
        },
      ],
      '/javascript/': [
        {
          title: 'General',
          collapsable: true,
          children: [
            'basico',
            'medio',
            'advanced',
          ]
        }
      ],
      '/sqlserver/': [
        {
          title: 'General',
          collapsable: true,
          children: [
            'tips',
          ]
        }
      ],
      '/pluralsight/': [
        {
          title: 'General',
          collapsable: true,
          children: [
            'debuger',
            'net5',
          ]
        }
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


