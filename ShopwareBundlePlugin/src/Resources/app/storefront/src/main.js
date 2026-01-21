import CmsBundleSliderPlugin from "./plugins/cmsbundle-slider.plugin";
import CmsBundleProductViewed from "./plugins/cmsbundle-product-viewed.plugin";
import CmsBundleRecentlyViewedProduct from "./plugins/cmsbundle-recently-viewed-product.plugin";

PluginManager.register(
  "CmsBundleSlider",
  CmsBundleSliderPlugin,
  "[data-cmsbundle-slider]"
);
PluginManager.register(
  "CmsBundleProductViewed",
  CmsBundleProductViewed,
  "[data-cmsbundle-product-viewed]"
);
PluginManager.register(
  "CmsBundleRecentlyViewedProduct",
  CmsBundleRecentlyViewedProduct,
  "[data-cmsbundle-recently-viewed-product]"
);
