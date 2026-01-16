import Plugin from 'src/plugin-system/plugin.class';

export default class applicationFormPlugin extends Plugin {
    init() {
        $("#anschreiben_file").change(function () {
            $('#anschreiben').attr("placeholder", $(this).val().split('\\').pop());
        });

        $("#lebenslauf_file").change(function () {
            $('#lebenslauf').attr("placeholder", $(this).val().split('\\').pop());
        });

        $("#zertifikate_file").change(function () {
            $('#zertifikate').attr("placeholder", $(this).val().split('\\').pop());
        });

        $("#arbeitszeugnisse_file").change(function () {
            $('#arbeitszeugnisse').attr("placeholder", $(this).val().split('\\').pop());
        });
    }
}