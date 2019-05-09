/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from "@storybook/vue";

import AlertBox from "../components/AlertBox.vue";

storiesOf("AlertBox", module)
  .add("with text", () => ({
    components: { AlertBox },
    template: "<alert-box><p>This is a standard alert!</p></alert-box>"
  }))
  .add("with Info", () => ({
    components: { AlertBox },
    template:
      "<alert-box class='info'><p>This is an info alert!</p></alert-box>"
  }))
  .add("with Error", () => ({
    components: { AlertBox },
    template:
      "<alert-box class='error'><p>This is an error alert!</p></alert-box>"
  }));
