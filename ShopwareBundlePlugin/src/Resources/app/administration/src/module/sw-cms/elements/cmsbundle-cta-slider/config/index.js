import template from "./sw-cms-el-config-cmsbundle-cta-slider.html.twig";
import "./sw-cms-el-config-cmsbundle-cta-slider.scss";

const { Component, Mixin } = Shopware;

Component.register("sw-cms-el-config-cmsbundle-cta-slider", {
  template,

  inject: ["repositoryFactory", "feature"],

  mixins: [Mixin.getByName("cms-element")],

  data() {
    return {
      ctaCollection: null,
    };
  },

  computed: {
    cta() {
      if (
        this.element?.data?.cta &&
        this.element.data.cta.length > 0
      ) {
        return this.element.data.cta;
      }

      return null;
    },

  },

  created() {
    this.createdComponent();
  },

  methods: {
    createdComponent() {
      this.initElementConfig("cmsbundle-cta-slider");

      this.ctaCollection = [];

      if (this.element.config.cta.value.length <= 0) {
        return;
      }

    },

  },
});
