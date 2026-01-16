const { Component } = Shopware;

Component.override('sw-import-export-edit-profile-modal', {

    created() {
        this.supportedEntities.push({
            value: 'vio_customer_price',
            label: this.$tc('sw-import-export.profile.customerPrices')
        });
    },
});
