// Handles login submit.
$("#login-form").submit(function(event) {
    var form_data = {
        "username": $("#login-usr").val(),
        "password": $("#login-pwd").val()
    }
    $.post("/handle-login", form_data)
        .done(function(data) {
            if (data["success"]) {
                location.assign("/success")
            } else {
                $("#login-form").trigger("reset");
                if (data["type"] == "password") {
                    $("#login-usr").val(data["username"])
                    addError(data["message"])
                } else {
                    addError(data["message"])
                }
            }
        });
    event.preventDefault();
})

// Adds an error HTML element above the signup form.
function addError(error) {
    var message = document.getElementById("error-message");
    if (!message) {
        message = document.createElement("p");
        message.setAttribute("id", "error-message");
    }
    message.innerHTML = error;

    $("#login-form").prepend(message);
}