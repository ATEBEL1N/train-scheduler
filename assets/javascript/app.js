$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBj15JGE1sm7qZkFrrrD2fXfDBM8F9Emyw",
        authDomain: "train-database-224a3.firebaseapp.com",
        databaseURL: "https://train-database-224a3.firebaseio.com",
        projectId: "train-database-224a3",
        storageBucket: "train-database-224a3.appspot.com",
        messagingSenderId: "1015184603444"
    };
    firebase.initializeApp(config);

    // Variable to reference the database.
    var database = firebase.database();

    // Variables for train
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Push to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function (Snapshot) {
        console.log(Snapshot.val());

        // Change year so first train comes before now
        var firstTrainNew = moment(Snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % Snapshot.val().frequency;
        // Minutes until next train
        var minAway = Snapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append(
            "<tr><td>" + Snapshot.val().name +
            "</td><td>" + Snapshot.val().destination +
            "</td><td>" + Snapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});