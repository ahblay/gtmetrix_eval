from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flaskext.mysql import MySQL
from flask_bcrypt import Bcrypt

# Initialize app
app = Flask(__name__)
app.secret_key = "nochanceofguessingthis"

# Initialize bycrpt
bcrypt = Bcrypt(app)

# Set up database connection
mysql = MySQL()
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'gtmetrix'
app.config['MYSQL_DATABASE_PASSWORD'] = 'testpass'
app.config['MYSQL_DATABASE_DB'] = 'gtmetrixdb'
mysql.init_app(app)
conn = mysql.connect()
cursor = conn.cursor()


@app.route('/')
def home():
    return render_template("home.html")


# Handles routing:
# if user already logged in --> renders welcome page
# else --> renders login form
@app.route('/login')
def render_login():
    if "username" in session:
        username = session["username"]
        return render_template("success.html", username=username)
    return redirect(url_for("handle_login"))


# Renders welcome message to logged in users
@app.route('/success')
def success():
    username = session["username"]
    return render_template("success.html", username=username)


# Handles login and validates login data against database
@app.route('/handle-login', methods=['POST', 'GET'])
def handle_login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        sql = "SELECT * FROM users WHERE username = %s"
        cursor.execute(sql, username)
        user_record = cursor.fetchone()
        if user_record:
            pwd_hash = user_record[2]
            if bcrypt.check_password_hash(pwd_hash, password):
                session["username"] = username
                return jsonify({"success": True})
            else:
                error = {"success": False,
                         "type": "password",
                         "message": "Sorry, your password seems to be incorrect.",
                         "username": username}
                return jsonify(error)

        else:
            error = {"success": False,
                     "type": "username",
                     "message": "Sorry, I don't recognize that username."}
            return jsonify(error)
    return render_template("login.html")


# Logs out user and clears session data
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('render_login'))



