// JobTrip API 文档主题配置

window.addEventListener('load', function() {
  // 检查ReDoc是否已加载
  if (window.Redoc) {
    // 自定义主题配置
    const theme = {
      // 排版设置
      typography: {
        fontSize: '16px',
        lineHeight: '1.6',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        headings: {
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: '600'
        },
        code: {
          fontSize: '14px',
          fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
          lineHeight: '1.4',
          backgroundColor: '#f5f5f5',
          color: '#333'
        }
      },
      
      // 颜色设置
      colors: {
        primary: {
          main: '#3f51b5',  // 主要颜色
          light: '#757de8',
          dark: '#002984',
          contrastText: '#fff'
        },
        success: {
          main: '#4caf50',
          light: '#80e27e',
          dark: '#087f23',
          contrastText: '#fff'
        },
        warning: {
          main: '#ff9800',
          light: '#ffc947',
          dark: '#c66900',
          contrastText: '#fff'
        },
        error: {
          main: '#f44336',
          light: '#ff7961',
          dark: '#ba000d',
          contrastText: '#fff'
        },
        text: {
          primary: '#333333',
          secondary: '#666666'
        },
        border: {
          dark: '#dddddd',
          light: '#eeeeee'
        },
        http: {
          get: '#4caf50',
          post: '#3f51b5',
          put: '#ff9800',
          delete: '#f44336',
          options: '#9c27b0',
          patch: '#009688',
          basic: '#795548',
          link: '#607d8b'
        }
      },

      // 形状设置
      shape: {
        borderRadius: '4px'
      },
      
      // 间距设置
      spacing: {
        unit: '8px',
        sectionVertical: '24px',
        sectionHorizontal: '40px'
      },
      
      // 响应式断点
      breakpoints: {
        small: '50rem',
        medium: '75rem',
        large: '105rem'
      }
    };

    // 应用自定义主题
    try {
      const redocEl = document.querySelector('redoc');
      if (redocEl) {
        redocEl.setAttribute('theme', JSON.stringify(theme));
        console.log('JobTrip API 文档主题已应用');
      }
    } catch (e) {
      console.error('应用ReDoc主题时出错:', e);
    }
  } else {
    console.warn('ReDoc尚未加载，无法应用自定义主题');
  }
}); 