import template from "./sw-cms-el-config-cmsbundle-best-seller-slider.html.twig";
import "./sw-cms-el-config-cmsbundle-best-seller-slider.scss";

const { Component, Mixin } = Shopware;
Component.register("sw-cms-el-config-cmsbundle-best-seller-slider", {
  template,

  inject: ["repositoryFactory", "feature"],

  mixins: [Mixin.getByName("cms-element")],
  created() {
    this.createdComponent();
  },

  methods: {
    createdComponent() {
      this.initElementConfig("cmsbundle-best-seller-slider");
    },
  },
});
