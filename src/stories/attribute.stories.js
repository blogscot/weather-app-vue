/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from "@storybook/vue";

import Attribute from "../components/Attribute.vue";

storiesOf("Attribute", module).add("with user link", () => ({
  components: { Attribute },
  template:
    '<Attribute photographer="Nathan Anderson" link="https://unsplash.com/@nathananderson"></Attribute>'
}));
