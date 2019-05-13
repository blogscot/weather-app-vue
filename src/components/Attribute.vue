<template>
  <div>
    Photo by
    <a :href="`${link}${unsplash_referral}`">{{ photographer }}</a>
    on
    <a :href="`https://unsplash.com/${unsplash_referral}`">Unsplash</a>
  </div>
</template>

<script>
export default {
  name: "Attribute",
  props: {
    photographer: String,
    link: String
  },
  data() {
    return {
      unsplash_referral:
        "?utm_source=the%20weather%20where%20you%20are&utm_medium=referral"
    };
  }
};
</script>
