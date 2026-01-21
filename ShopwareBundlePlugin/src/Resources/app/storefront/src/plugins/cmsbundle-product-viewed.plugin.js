import Plugin from "src/plugin-system/plugin.class";

export default class CmsBundleProductViewed extends Plugin {
  init() {
    this.productId = this.options.productId;

    this._loadRecentlyViewedProducts();

    this._saveToRecentlyViewedProducts();
  }

  _loadRecentlyViewedProducts() {
    const products =
      JSON.parse(localStorage.getItem("CmsBundleProductsViewed")) || [];
    this._products = products;
  }

  _saveToRecentlyViewedProducts() {
    if (this._productAlreadyViewed()) {
      return;
    }

    this._products.push(this.productId);

    localStorage.setItem(
      "CmsBundleProductsViewed",
      JSON.stringify(this._products)
    );
  }

  _productAlreadyViewed() {
    return this._products.includes(this.productId);
  }
}
