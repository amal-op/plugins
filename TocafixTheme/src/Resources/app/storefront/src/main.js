import TocafixFooterPlugin from './plugins/footer';
import applicationFormPlugin from './plugins/application-form.plugin';

PluginManager.register('TocafixFooterPlugin', TocafixFooterPlugin, '.footer-main');
PluginManager.register('applicationFormPlugin', applicationFormPlugin);