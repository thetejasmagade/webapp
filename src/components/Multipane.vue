<template>
  <div
    class="
      multipane
      flex
    "
    :class="classnames"
    :style="{ cursor, userSelect }"
    @mousedown="onMouseDown"
  >
    <slot />
  </div>
</template>

<script>
const layoutVertical = 'vertical';
const layoutHorizontal = 'horizontal';

// taken from https://github.com/yansern/vue-multipane
export default {
  name: 'Multipane',
  emits: [ 'paneResizeStart', 'paneResize', 'paneResizeStop' ],
  props: {
    layout: {
      type: String,
      default: layoutHorizontal
    }
  },

  data() {
    return {
      isResizing: false
    };
  },

  computed: {
    classnames() {
      return [
        'layout-' + this.layout.slice(0, 1),
        this.isResizing ? 'is-resizing' : ''
      ];
    },
    cursor() {
      return this.isResizing
        ? this.layout == layoutHorizontal ? 'col-resize' : 'row-resize'
        : '';
    },
    userSelect() {
      return this.isResizing ? 'none' : '';
    }
  },

  methods: {
    onMouseDown({ target: resizer, pageX: initialPageX, pageY: initialPageY }) {
      if (
        resizer.className &&
        resizer.className.match &&
        resizer.className.match('multipane-resizer')) {
        let self = this;
        let { $el: container, layout } = self;

        let pane = resizer.previousElementSibling;

        if (!pane){
          return;
        }
        let {
          offsetWidth: initialPaneWidth,
          offsetHeight: initialPaneHeight
        } = pane;

        let usePercentage = !!(pane.style.width + '').match('%');

        const { addEventListener, removeEventListener } = window;

        const resize = (initialSize, offset = 0) => {
          if (layout === layoutHorizontal && resizer.className.match('horizontal')) {
            let containerWidth = container.clientWidth;
            let paneWidth = initialSize + offset;

            return (pane.style.width = usePercentage
              ? paneWidth / containerWidth * 100 + '%'
              : paneWidth + 'px');
          }

          if (layout === layoutVertical && resizer.className.match('vertical')) {
            let containerHeight = container.clientHeight;
            let paneHeight = initialSize + offset;

            return (pane.style.height = usePercentage
              ? paneHeight / containerHeight * 100 + '%'
              : paneHeight + 'px');
          }
        };

        // This adds is-resizing class to container
        self.isResizing = true;

        // Resize once to get current computed size
        let size = resize();

        // Trigger paneResizeStart event
        self.$emit('paneResizeStart', pane, resizer, size);

        const onMouseMove = function({ pageX, pageY }) {
          size =
            layout == layoutHorizontal
              ? resize(initialPaneWidth, pageX - initialPageX)
              : resize(initialPaneHeight, pageY - initialPageY);

          self.$emit('paneResize', pane, resizer, size);
        };

        const onMouseUp = function() {
          // Run resize one more time to set computed width/height.
          size =
            layout == layoutHorizontal
              ? resize(pane.clientWidth)
              : resize(pane.clientHeight);

          // This removes is-resizing class to container
          self.isResizing = false;

          removeEventListener('mousemove', onMouseMove);
          removeEventListener('mouseup', onMouseUp);

          self.$emit('paneResizeStop', pane, resizer, size);
        };

        addEventListener('mousemove', onMouseMove);
        addEventListener('mouseup', onMouseUp);
      }
    }
  }
};
</script>

<style>
.layout-v {
  flex-direction: column;
  height: 100%;
}

.layout-h {
  flex-direction: row;
  width: 100%;
}

.multipane > div {
  position: relative;
}

.layout-v > .multipane-resizer {
  width: 100%;
  height: 10px;
  margin-top: -10px;
  top: 5px;
  cursor: row-resize;
}

.layout-h > .multipane-resizer {
  width: 10px;
  height: 100%;
  margin-left: -10px;
  left: 5px;
  cursor: col-resize;
}
</style>
