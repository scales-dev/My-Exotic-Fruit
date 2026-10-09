function applyPost(file, script, files) {
  const widgetsTag = file.scripts.match(/\$widgets\s*=\s*[^\^]*?\^/g)?.[0];

  file.scripts = file.scripts.replace(widgetsTag, "");

  const widgets = widgetsTag ? widgetsTag
    .split("=")[1]
    .replace("^", "")
    .trim()
    .split(",")
    .map(widget => `"${widget}"`)
    : [];

  file.scripts += shadowScript.replace("$widgets^", `[${widgets.join(",")}]`);
}

module.exports = { applyPost };

const shadowScript =
  `<script>
  class StyleBlocker extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      const widgetClasses = $widgets^;

      const widgets = widgetClasses
        .map(className => this.embedWidget(className))
        .filter(Boolean);

      // move EVERYTHING (except external widgets) into the shadow realm 
      // or smth idk https://matthewjamestaylor.com/style-blocker
      [...this.childNodes].forEach(node => {
        if (!widgets.includes(node)) {
          this.shadowRoot.appendChild(node);
        }
      });
    }

    embedWidget(className) {
      const widget = this.querySelector("." + className);

      if (!widget) return null;

      const slot = document.createElement("slot");
      slot.name = className;

      widget.parentNode.replaceChild(slot, widget);

      widget.slot = className;
      this.appendChild(widget);

      return widget;
    }
  }

  customElements.define("style-blocker", StyleBlocker);
</script>`