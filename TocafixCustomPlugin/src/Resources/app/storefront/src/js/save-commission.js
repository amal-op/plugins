import Plugin from 'src/plugin-system/plugin.class';
import HttpClient from 'src/service/http-client.service';
import DomAccess from 'src/helper/dom-access.helper';
import FormSerializeUtil from 'src/utility/form/form-serialize.util';

export default class TocafixCommissionPlugin extends Plugin {

    static options = {
        replaceSelectors: false,
        submitOnChange: false,
        saveButtonSelector: '.save-commisions',
    };

    init() {
        this._client = new HttpClient(window.accessKey, window.contextToken);
        this._form = this.el;
        this._saveButton = DomAccess.querySelector(this.el, this.options.saveButtonSelector);
        this._messageDisplay = document.querySelector('.commission-response');

        this._registerEvents();
    }

    _registerEvents() {
        this._saveButton.addEventListener('click', this._handleSubmit.bind(this));
    }

    _onKeypress(event) {
        if (event.key === 'Enter') {
            this._handleSubmit(event);
        }
    }

    _handleSubmit(event) {
        event.preventDefault();
        if (this._form.checkValidity() === false) {
            return;
        }

        this.$emitter.publish('beforeSubmit');
        this._fireRequest();
    }

    _fireRequest() {
        this._createLoadingIndicators();
        const action = DomAccess.getAttribute(this._form, 'data-action');
        this.$emitter.publish('beforeFireRequest');
        this._client.post(action, this._getFormData(), this._onAfterAjaxSubmit.bind(this));
    }

    _getFormData() {
        return FormSerializeUtil.serialize(this._form);
    }

    _onAfterAjaxSubmit(response) {
        response = JSON.parse(response);
        this._messageDisplay.innerHTML = response.alert;
        this._messageDisplay.classList.remove('d-none');
        
        this.$emitter.publish('onAfterAjaxSubmit', { response });
    }

    _createLoadingIndicators() {
        this.$emitter.publish('createLoadingIndicators');
    }

    _removeLoadingIndicators() {
        this.$emitter.publish('removeLoadingIndicators');
    }
}
