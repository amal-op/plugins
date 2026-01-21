import Plugin from "src/plugin-system/plugin.class";
import ElementReplaceHelper from "src/helper/element-replace.helper";
import HttpClient from "src/service/http-client.service";
import DomAccess from "src/helper/dom-access.helper";

export default class CmsBundleRecentlyViewedProduct extends Plugin {
  init() {
    this._loadRecentlyViewedProductIds();

    this._client = new HttpClient();

    this._fetchProducts();
  }

  /**
   * Load the recently viewed product IDs from local storage.
   *
   * @return {void}
   */
  _loadRecentlyViewedProductIds() {
    let productIds =
      JSON.parse(localStorage.getItem("CmsBundleProductsViewed")) || [];
    productIds = productIds.reverse();
    this._productIds = productIds;
  }

  /**
   * Fetches the products by making a POST request to the server.
   *
   * @return {Promise} A promise that resolves with the response from the server.
   */
  _fetchProducts() {
    if (this.options.route)
      this._client.post(
        this.options.route,
        this._getData(),
        this._onResponse.bind(this)
      );
  }

  /**
   * Handles the response received from the server.
   *
   * @param {Object} response - The response received from the server.
   */
  _onResponse(response) {
    if (this.options.replaceSelectors) {
      const jsss = this.el
        .closest(".js-slider-initialized")
        .classList.remove("js-slider-initialized");
      //   DomAccess.querySelector(document, this.options.replaceSelectors);
      ElementReplaceHelper.replaceFromMarkup(
        response,
        this.options.replaceSelectors,
        false
      );

      window.PluginManager.initializePlugins();
    }
  }

  _getData() {
    return JSON.stringify({
      productIds: this._productIds,
      layoutColumns: this.options.layoutColumns,
      sidebar: this.options.sidebar,
      boxLayout: this.options.boxLayout,
      displayMode: this.options.displayMode,
      productsPerPage: parseInt(this.options.productsPerPage),
    });
  }
}
