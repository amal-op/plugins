const { Component ,Context } = Shopware;

Component.extend("tocafix-team-create", "tocafix-team-detail", {
  methods: {
    createdComponent() {
      const systemLanguageId = Context.api.systemLanguageId;
      const currentLanguageId = Context.api.languageId;

      if (currentLanguageId !== systemLanguageId) {
        Shopware.State.commit("context/setApiLanguageId", systemLanguageId);
      }

      this.$super("createdComponent");
    },
    getTeam() {
      this.team = this.repository.create(Context.api);
    },

    onClickSave() {
      this.isLoading = true;

      this.repository
        .save(this.team, Context.api)
        .then(() => {
          this.isLoading = false;
          this.$router.push({
            name: "tocafix.team.detail",
            params: { id: this.team.id },
          });
        })
        .catch((exception) => {
          this.isLoading = false;

          this.createNotificationError({
            title: this.$t("tocafix-team.detail.errorTitle"),
            message: exception,
          });
        });
    },
  },
});