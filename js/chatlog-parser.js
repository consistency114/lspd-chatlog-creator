function useRegex(input) {
    let regex = /([01]\d|2[0-3]):[0-5]\d:[0-5]\d/;
    return regex.test(input);
}

$(document).ready(function() {
    function e() {
        $(".generated").remove();
        $(".clear").remove();

        var lines = $("textarea").val().replace("<script>", "").replace("</script>", "").split("\n");

        for (var t = 0; t < lines.length; t++) {
            var line = useRegex(lines[t]) ? lines[t].slice(10) : lines[t];

            // Filter out lines starting with specific characters
            if (!/^\[|^\*\*\(\(|^\{|^\*\*\*|^\//.test(line.trim())) {
                $(".output").append(
                    '<div class="generated" id="chatlogOutput">' +
                    line +
                    '</div><div class="clear"></div>'
                );
            }
        }

        $(".generated").each(function() {
            var line = $(this).text();
            var formattedLines = [];
            var lines = line.split('\n');

            for (var i = 0; i < lines.length; i++) {
                var currentLine = lines[i];

                // Replace color codes
                function replaceColorCodes(str) {
                    return str.replace(/\{([A-Fa-f0-9]{6})\}/g, function(match, p1) {
                        return '<span style="color: #' + p1 + ';">';
                    }).replace(/\{\/([A-Fa-f0-9]{6})\}/g, '</span>');
                }

                currentLine = replaceColorCodes(currentLine);
                formattedLines.push(currentLine);
            }

            var formattedText = formattedLines.join('<br>');

            navigator.userAgent.indexOf("Chrome") != -1 && $(this).append(" ⠀");
            formattedText.toLowerCase().indexOf("*") >= 0 && $(this).addClass("me");

            formattedText.toLowerCase().indexOf(" says:") >= 0 && $(this).addClass("white");
            formattedText.toLowerCase().indexOf(" [low]:") >= 0 && $(this).addClass("grey");

            formattedText.toLowerCase().indexOf(", $") >= 0 && $(this).addClass("grey");
            formattedText.toLowerCase().indexOf("you have received $") >= 0 && $(this).addClass("grey");

            formattedText.toLowerCase().indexOf(" whispers:") >= 0 && $(this).addClass("whisper");
            formattedText.toLowerCase().indexOf(" whispers:") >= 0 && formattedText.toLowerCase().indexOf("(car)") >= 0 && $(this).addClass("carwhisper");
            formattedText.toLowerCase().indexOf(" (phone)") >= 0 && $(this).addClass("whisper");
            formattedText.toLowerCase().indexOf(":o<") >= 0 && $(this).addClass("whisper");
            formattedText.toLowerCase().indexOf(" (phone - low)") >= 0 && $(this).addClass("whisper");

            formattedText.toLowerCase().indexOf(" [san interview]") == 0 && $(this).addClass("news");
            formattedText.toLowerCase().indexOf("[san interview]") == 0 && $(this).addClass("news");
            formattedText.toLowerCase().indexOf(" **[ch:") == 0 && $(this).addClass("radio");
            formattedText.toLowerCase().indexOf("**[ch:") == 0 && $(this).addClass("radio");

            if (formattedText.toLowerCase().startsWith(" ** hq: ") && formattedText.toLowerCase().endsWith("! **")) {
            $(this).addClass("hqduty").removeClass("me");
            }
            
            formattedText.toLowerCase().startsWith(" ** [") && formattedText.toLowerCase().includes("]") && /\[.*?\]/.test(formattedText) && $(this).addClass("dep");
            formattedText.toLowerCase().startsWith("** [") && formattedText.toLowerCase().includes("]") && /\[.*?\]/.test(formattedText) && $(this).addClass("dep");

            // Remove lines that start with "Saving screenshot", "USAGE:", or "You took off your"
            if (
                formattedText.trim().toLowerCase().startsWith("saving screenshot") || 
                formattedText.trim().toLowerCase().startsWith("usage:") || 
                formattedText.trim().toLowerCase().startsWith("you took off your") ||
                formattedText.trim().toLowerCase().startsWith("(( [")
            ) {
                $(this).remove(); // Remove the line
                return; // Ensure no further processing is done for this line
            }

            let skipLines = 0; // Variable to track the number of lines to highlight

            $(".generated").each(function() {
                var formattedText = $(this).text().trim().toLowerCase();
            
                // If we are in skip mode, apply the 'hq' class and decrement the counter
                if (skipLines > 0) {
                    $(this).addClass("hq");
                    skipLines--;
                    return; // Skip further processing for this line
                }
            
                // Check for the specific "Emergency call" line
                if (formattedText.includes("|____________emergency call____________|")) {
                    skipLines = 5; // Set the counter to 5 lines (current + next 4)
                    $(this).addClass("hq"); // Apply the 'hq' class to the current line
                    return; // Skip further processing for this line
                }
            
                // Additional conditions or formatting logic can go here...
            });
            


            $(this).html(formattedText);

            $(this).textContent += "‎  ";
            formattedText || $(this).remove();
            $(".generated:first").css("margin-top", "30px");
            $(".generated:first").css("padding-top", "10px");
            $(".generated:last").css("padding-bottom", "10px");
            $(".generated:last").css("margin-bottom", "30px");
            $(".generated").css("background-color", "black");
        });

    }

    charName = $("#name").val().toLowerCase();
    var t = $.jStorage.get("lastCharName");
    t || $.jStorage.set("lastCharName", ""),
        $("#name").val($.jStorage.get("lastCharName")),
        $("#name").bind("input propertychange", function() {
            (charName = $("#name").val().toLowerCase()),
            $.jStorage.set("lastCharName", charName),
                e();
        });

    var r = $.jStorage.get("lastFontSize"),
        o = $.jStorage.get("lastLineHeight");
    r || o ? ($(".output").css({
            "font-size": $.jStorage.get("lastFontSize") + "px",
            "line-height": ($.jStorage.get("lastFontSize") - 10) + "px",
        }),
        $("#font-label").text(
            "font size (" + $.jStorage.get("lastFontSize") + "px):"
        )) :
    ($.jStorage.set("lastFontSize", "12"),
    $.jStorage.set("lastLineHeight", ($.jStorage.get("lastFontSize") - 10))),
    $(".output").css({
        "font-size": "12px",
        "line-height": "2px",
    })
    
    $("input[name='font-label']").bind("input propertychange", function() {
        var newSize = parseInt($(this).val());
        if (newSize >= 10 && newSize <= 64) {
            $(".output").css({
                "font-size": newSize + "px",
                "line-height": (newSize - 10) + "px",
            });
            $("#font-label").text("font size (" + newSize + "px):");
            $.jStorage.set("lastFontSize", newSize);
            $.jStorage.set("lastLineHeight", newSize);
        } else {}
    });

    $("textarea").bind("input propertychange", function() {
        e();
    });

    $("#color-picker").spectrum({
        color: "#000",
        showInput: !0,
        preferredFormat: "hex",
        change: function() {
            $.jStorage.set("lastColor", $("#color-picker").spectrum("get").toHex()),
                $(".generated").css("background-color", "transparent");
        },
    }),
    $("#color-picker").spectrum("set", $.jStorage.get("lastColor"));
});
