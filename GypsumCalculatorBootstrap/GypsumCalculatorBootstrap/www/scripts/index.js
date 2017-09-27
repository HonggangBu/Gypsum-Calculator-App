// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        // Dynamically show the current year in the footer copyright
        $(".dynamic-year").text((new Date()).getFullYear());


        // go to home tab when the app logo is clicked
        document.getElementById("GoHome").addEventListener("click", function () {
            $('.nav-tabs a[href="#home"]').tab('show');
        });

        //
        OnEspSarSelectChange();

        //
        ClearInputCollection();

        //
        $('input[type=text]').each(function () {
            $(this).on("change", function () {
                $('#resultSpan').text('');
            });
        });


        //
        OnCalculateBtnClick();
    }

    // 
    function OnEspSarSelectChange() {

        $("input[name='optradio']").on("change", function () {
            $('#resultSpan').text('');
            if ($("input[name='optradio']:checked").val() === 'esp') {
                $("#espInputDiv").show();
                $("#sarInputDiv").hide();
            }
            else {
                $("#espInputDiv").hide();
                $("#sarInputDiv").show();
            }
        });
    }

    //
    function ClearInput(clearBtnFull, inputControlFull) {
        clearBtnFull.click(function (e) {
            $(inputControlFull).val('');
            $('#resultSpan').text('');
        });
    }

    //
    function ClearInputCollection() {
        ClearInput($('#depthClearBtn'), 'input[id=depthInput]');
        ClearInput($('#densityClearBtn'), 'input[id=densityInput]');
        ClearInput($('#cecClearBtn'), 'input[id=cecInput]');
        ClearInput($('#purityClearBtn'), 'input[id=purityInput]');
        ClearInput($('#espiClearBtn'), 'input[id=espiInput]');
        ClearInput($('#espfClearBtn'), 'input[id=espfInput]');
        ClearInput($('#sariClearBtn'), 'input[id=sariInput]');
        ClearInput($('#sarfClearBtn'), 'input[id=sarfInput]');
    }

    //
    function GetFactorValue(espf) {
        var f;
        if (espf >= 15)
            f = 1.1;
        else if (espf <= 5)
            f = 1.3;
        else
            f = 1.4 - 0.02 * espf;
        return f;
    }

    //
    function NumericInputValidation(inputId) {
        var ss = 'input[id=' + inputId + ']';
        var v = $.trim($(ss).val());
        if (!($.isNumeric(v) && (v > 0) && (v.length > 0))) {
            return NaN;
        }
        else
            return v;
    }

    //
    function NumericInputValidation2(inputId) {
        var ss = 'input[id=' + inputId + ']';
        var v = $.trim($(ss).val());
        if (!($.isNumeric(v) && (v > 0) && (v.length > 0) && (v <= 100))) {
            return NaN;
        }
        else
            return v;
    }

    //
    function GypsumRequirement(fct, depth, density, cec, iv, fv, p) {
        return 0.86 * fct * depth * density * cec * (iv - fv) / p;
    }

    function OnCalculateBtnClick() {
        document.getElementById("calcBtn").addEventListener("click", function () {
            var k = 0, f, gr;
            var alertstr = 'Invalid input for each of the following field(s):\n\n';

            var depthValue = Number(NumericInputValidation('depthInput'));
            if (isNaN(depthValue)) {
                alertstr += '- ' + 'Soil Depth' + '\n';
                k += 1;
            }

            var densityValue = Number(NumericInputValidation('densityInput'));
            if (isNaN(densityValue)) {
                alertstr += '- ' + 'Soil Bulk Density' + '\n';
                k += 1
            }

            var cecValue = Number(NumericInputValidation('cecInput'));
            if (isNaN(cecValue)) {
                alertstr += '- ' + 'CEC' + '\n';
                k += 1
            }

            var purityValue = Number(NumericInputValidation2('purityInput'));
            if (isNaN(purityValue)) {
                alertstr += '- ' + 'Gypsum Purity' + '\n';
                k += 1
            }

            if ($("input[name='optradio']:checked").val() === 'esp') {
                var espiValue = Number(NumericInputValidation('espiInput'));
                if (isNaN(espiValue)) {
                    alertstr += '- ' + 'Initial ESP' + '\n';
                    k += 1
                }

                var espfValue = Number(NumericInputValidation('espfInput'));
                if (isNaN(espfValue)) {
                    alertstr += '- ' + 'Target ESP' + '\n';
                    k += 1
                }
            }
            else {
                var sariValue = Number(NumericInputValidation('sariInput'));
                if (isNaN(sariValue)) {
                    alertstr += '- ' + 'Initial SAR' + '\n';
                    k += 1
                }

                var sarfValue = Number(NumericInputValidation('sarfInput'));
                if (isNaN(sarfValue)) {
                    alertstr += '- ' + 'Target SAR' + '\n';
                    k += 1
                }
            }


            if (k > 0)
                alert(alertstr);
            else {
                // do calculation
                if ($("input[name='optradio']:checked").val() === 'esp') {
                    if (espfValue < espiValue) {
                        f = GetFactorValue(espfValue);
                        gr = GypsumRequirement(f, depthValue, densityValue, cecValue, espiValue, espfValue, purityValue);
                        $('#resultSpan').text('' + gr.toFixed(1));
                    }
                    else
                        alert('Target ESP level must be lower than Initial ESP level!');
                }
                else {
                    if (sarfValue < sariValue) {
                        f = GetFactorValue(sarfValue);
                        gr = GypsumRequirement(f, depthValue, densityValue, cecValue, sariValue, sarfValue, purityValue);
                        $('#resultSpan').text('' + gr.toFixed(1));
                    }
                    else
                        alert('Target SAR level must be lower than Initial SAR level!');
                }

            }





        });



    }


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();