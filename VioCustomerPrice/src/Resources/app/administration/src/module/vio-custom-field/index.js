const { Component } = Shopware;
const { Criteria } = Shopware.Data;
Component.override('sw-custom-field-set-detail-base', {
    inject: ['repositoryFactory', 'acl', 'customFieldDataProviderService'],
    data() {
        return {
            customerGroup: [],
            propertyNames: {
                label: this.$tc('sw-settings-custom-field.customField.detail.labelLabel'),
                description: this.$tc('Description')
            },
        };
    },
    created() {
        this.loadCustomFieldSets();
    },
    methods: {
        loadCustomFieldSets() {
            this.customFieldDataProviderService.getCustomFieldSets('customer_price').then((sets) => {
                this.customFieldSets = sets;
            });
            let entityResults = {};
            const criteria = new Criteria();
            criteria.addSorting(Criteria.sort('createdAt', 'DESC'));
        },
    },
    computed: {
        customFieldRepository() {
            return this.repositoryFactory.create('custom_field_set');
        },
        relationEntityNames() {
            if (!this.set.relations) {
                return [];
            }
            const oldEntityNames = this.customFieldDataProviderService.getEntityNames();
            if(oldEntityNames.indexOf('customer_price') === -1) {
                this.customFieldDataProviderService.addEntityName('customer_price');
            }
            const entityNames = this.customFieldDataProviderService.getEntityNames();

            return entityNames.map(entityName => {
                const relation = this.customFieldSetRelationRepository.create();
                relation.entityName = entityName;
                this.$set(relation, 'searchField', {});

                Object.keys(this.$root.$i18n.messages).forEach(locale => {
                    if (!this.$te(`global.entities.${entityName}`)) {
                        return;
                    }

                    this.$set(
                        relation.searchField,
                        locale,
                        this.$tc(`global.entities.${entityName}`, 2, locale),
                    );
                });
                return relation;
            });
        }
    },
});
