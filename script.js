(function () {
    "use strict";
    var DoSolvabilityTestsOnStart = false;

    var GameLevelSize = 5;
    var GameLevelClicks = 5;
    var BoardGeneratorClickDistance = 3;

    var TimerIntervalHandler;
    var TimerElapsedSeconds;

    var IsLocalStorageSupported;

    $(document).ready(function () {
        if (DoSolvabilityTestsOnStart) {
            doSolvabilityTests();
        }

        checkLocalStorageSupport();

        initResults();
        initButtonsAndLinks();
    });

    // modify IsLocalStorageSupported
    var checkLocalStorageSupport = function () {
        try {
            window.localStorage.getItem("any");
            IsLocalStorageSupported = true;
        } catch (e) {
            IsLocalStorageSupported = false;

            var notSupportedText = "Twoja przeglądarka nie wspiera localStorage.\n" +
                "Dla Firefox, Chrome, Opera powinno działać.\n" +
                "IE nie wspiera localStorage dla plików lokalnych (protokół file://).\n\n" +
                "Gra będzie działała bez trybu zapamiętywania zwycieżców.";
            window.alert(notSupportedText);
        }
    };

    var toggleGameScene = function () {
        $("#results").toggleClass("hidden");
        $("#start").toggleClass("hidden");
        $("#game").toggleClass("hidden");
    };

    var initButtonsAndLinks = function () {
        $(".btn").click(function () {
            startGame();
            toggleGameScene();
        });

        $(".reset").click(function () {
            $(".used").removeClass("on");
        });

        $(".new").click(startGame);
        $(".back").click(backToStart);
    };

    var startGame = function () {
        stopTimer();
        initFreshTable();
        initSolvableGameBoard();
        initTDClicks();
        startTimer();
    };

    // modify TimerIntervalHandler, TimerElapsedSeconds
    var startTimer = function () {
        TimerElapsedSeconds = undefined;
        updateTimer();
        TimerIntervalHandler = window.setInterval(updateTimer, 1000);
    };

    var stopTimer = function () {
        if (TimerIntervalHandler) {
            window.clearInterval(TimerIntervalHandler);
            TimerIntervalHandler = undefined;
        }
    };

    // modify $("table")
    var initFreshTable = function () {
        var $table = $("table");
        $table.html("");

        for (var row = 0; row < GameLevelSize; row++) {
            $table.append(getNewRow());
        }
    };

    var getNewRow = function () {
        var $row = $("<tr/>");
        for (var col = 0; col < GameLevelSize; col++) {
            $row.append(getNewCol());
        }
        return $row;
    };

    var getNewCol = function () {
        return $("<td/>");
    };

    // modify TimerElapsedSeconds
    var updateTimer = function () {
        TimerElapsedSeconds = TimerElapsedSeconds + 1 || 0;
        $("#timer").html(timerToString(TimerElapsedSeconds));
    };

    var timerToString = function (timerSecondsArg) {
        var seconds = timerSecondsArg % 60;
        var minutes = ~~(timerSecondsArg / 60);
        return padLeft(minutes, 2) + ":" + padLeft(seconds, 2);
    };

    var padLeft = function (str, n, padstr) {
        return new Array(n - String(str).length + 1).join(padstr || "0") + str;
    };

    var clickToggle = function ($td, col, toggledClass, shouldHasUsedClass) {
        clickToggleClass($td, toggledClass, shouldHasUsedClass);
        clickToggleClass($td.next("td"), toggledClass, shouldHasUsedClass);
        clickToggleClass($td.prev("td"), toggledClass, shouldHasUsedClass);

        var elem = "td:nth-child(" + col + ")";
        clickToggleClass($td.parent().next("tr").find(elem), toggledClass, shouldHasUsedClass);
        clickToggleClass($td.parent().prev("tr").find(elem), toggledClass, shouldHasUsedClass);
    };

    var clickToggleClass = function ($elem, toggledClass, shouldHasUsedClass) {
        if (!shouldHasUsedClass || $elem.hasClass("used")) {
            $elem.toggleClass(toggledClass);
        }
    };

    var initTDClicks = function () {
        $("td.used").click(function (e) {
            clickToggle($(this), e.target.cellIndex + 1, "on", true);
            if (isSolved()) {
                notifySolved();
            }
        });
    };

    var getTDByCoords = function (row, col) {
        return $("tr:nth-child(" + row + ")").find("td:nth-child(" + col + ")");
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function limitUp(val, max) {
        return val <= max ? val : max;
    }

    function limitDown(val, min) {
        return val >= min ? val : min;
    }

    function getNewRandomPos(oldpos) {
        return getRandomInt(limitDown(oldpos - BoardGeneratorClickDistance, 1),
            limitUp(oldpos + BoardGeneratorClickDistance, GameLevelSize));
    }

    var initSolvableGameBoard = function (testmode) {
        var row, col;
        var solutionPoints = [];

        row = getRandomInt(1, GameLevelSize);
        col = getRandomInt(1, GameLevelSize);

        for (var i = 0; i < GameLevelClicks; i++) {
            row = getNewRandomPos(row);
            col = getNewRandomPos(col);

            if (willCrossSolutionPoints(row, col, solutionPoints)) {
                i--;
                continue;
            }

            clickToggle(getTDByCoords(row, col), col, "used", false);
            solutionPoints.push([row, col]);
        }

        if (testmode) return solutionPoints;
        printSolution(solutionPoints);

    };

    var willCrossSolutionPoints = function (row, col, solutionPoints) {
        var i, len;
        for (i = 0, len = solutionPoints.length; i < len; ++i) {
            if (row === solutionPoints[i][0] && col === solutionPoints[i][1]) return true;
            if (row + 1 === solutionPoints[i][0] && col === solutionPoints[i][1]) return true;
            if (row - 1 === solutionPoints[i][0] && col === solutionPoints[i][1]) return true;
            if (row === solutionPoints[i][0] && col + 1 === solutionPoints[i][1]) return true;
            if (row === solutionPoints[i][0] && col - 1 === solutionPoints[i][1]) return true;
        }
        return false;
    };

    var printSolution = function (solutionPoints) {
        console.log("-- generated new solution -- ");

        for (var i = 0, len = solutionPoints.length; i < len; i++) {
            console.log("click(" + solutionPoints[i][0] + "," + solutionPoints[i][1] + ")");
        }
    };

    var isSolved = function () {
        var solved = 1;
        $("td.used").each(function () {
            solved &= $(this).hasClass("on");
        });
        return solved;
    };

    var notifySolved = function () {
        stopTimer();
        updateTimer();

        var alertText = "Wygrana!\n" +
            "Twój czas to: " + timerToString(TimerElapsedSeconds);
        window.alert(alertText);

        askAboutNameAndSaveResult();
        backToStart();
    };

    var askAboutNameAndSaveResult = function () {
        if (!IsLocalStorageSupported) return;

        var nickname = window.prompt("Wpisz proszę swoje imię:", "anonimowy");
        if (!nickname) nickname = "anonimowy";

        window.localStorage.setItem(nickname, TimerElapsedSeconds);
    };

    var backToStart = function () {
        stopTimer();
        initResults();
        toggleGameScene();
    };

    var compareSecondColumn = function (a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    };

    var initResults = function () {
        if (!IsLocalStorageSupported) return;

        var results = [];

        for (var key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                var value = window.localStorage.getItem(key);

                var nickname = key;
                var time = parseInt(value);

                results.push([nickname, time]);
            }
        }

        if (results.length) {
            results.sort(compareSecondColumn);

            var $ul = $("#results").find("ul");
            $ul.html("");

            var i, len;
            for (i = 0, len = results.length; i < len; ++i) {
                $ul.append($("<li/>").text(results[i][0] + " => " + timerToString(results[i][1])));
            }
        }
    };

    var doSolvabilityTests = function () {
        var noOfTests = 100;
        var passedTests = 0;

        var loops = noOfTests;
        while (loops--) {
            initFreshTable();
            var solutionPoints = initSolvableGameBoard(true);

            for (var i = 0, len = solutionPoints.length; i < len; i++) {
                clickToggle(getTDByCoords(solutionPoints[i][0], solutionPoints[i][1]),
                    solutionPoints[i][1], "on", true);
            }

            passedTests += isSolved() | 0;
        }

        console.log("[random boards solvability start test] passed: " + passedTests + "/" + noOfTests);
    };

})();
