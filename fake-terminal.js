"use strict";

/**
 * Configs
 */
var configs = (function () {
  var instance;
  var Singleton = function (options) {
    var options = options || Singleton.defaultOptions;
    for (var key in Singleton.defaultOptions) {
      this[key] = options[key] || Singleton.defaultOptions[key];
    }
  };
  Singleton.defaultOptions = {
    general_help: "Below there's a list of commands that you can use.",
    help_help: "Print this menu.",
    whoami_help: "Print information about me.",
    getemail_help: "Print my email to get in contact.",
    getsocial_help: "Print my social media",
    getcv_help: "Print a list of experiences",
    welcome: "Welcome to my interactive terminal. Type 'help' to list the available commands. In order to skip text rolling, double click/touch anywhere.\n",
    internet_explorer_warning: "NOTE: I see you're using internet explorer, this website won't work properly.",
    invalid_command_message: "<value>: command not found.",
    value_token: "<value>",
    user: "diniguez",
    host: "cv-web",
    type_delay: 20
  };
  return {
    getInstance: function (options) {
      instance === void 0 && (instance = new Singleton(options));
      return instance;
    }
  };
})();

var main = (function () {

  /**
   * Aux functions
   */
  var isUsingIE = window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

  var ignoreEvent = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };

  var scrollToBottom = function () {
    var objDiv = document.getElementById("terminal");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  var isURL = function (str) {
    return (str.startsWith("http") || str.startsWith("www")) && str.indexOf(" ") === -1 && str.indexOf("\n") === -1;
  };

  /**
   * Model
   */
  var InvalidArgumentException = function (message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, InvalidArgumentException);
    } else {
      this.stack = (new Error()).stack;
    }
  };
  // Extends Error
  InvalidArgumentException.prototype = Object.create(Error.prototype);
  InvalidArgumentException.prototype.name = "InvalidArgumentException";
  InvalidArgumentException.prototype.constructor = InvalidArgumentException;

  var cmds = {
    HELP: { value: "help", help: configs.getInstance().help_help },
    WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
    GETEMAIL: { value: "getemail", help: configs.getInstance().getemail_help },
    GETSOCIAL: { value: "getsocial", help: configs.getInstance().getsocial_help},
    GETCV: { value: "getcv", help: configs.getInstance().getcv_help},
  };

  var Terminal = function (prompt, cmdLine, output, user, host, outputTimer) {
    if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
    }
    if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
      throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
    }
    if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
    }
    (typeof user === "string" && typeof host === "string") && (this.completePrompt = user + "@" + host + ":~" + ("$"));
    this.prompt = prompt;
    this.cmdLine = cmdLine;
    this.output = output;
    this.typeSimulator = new TypeSimulator(outputTimer, output);
  };

  Terminal.prototype.type = function (text, callback) {
    this.typeSimulator.type(text, callback);
  };

  Terminal.prototype.exec = function () {
    var command = this.cmdLine.value;
    this.cmdLine.value = "";
    this.prompt.textContent = "";
    this.output.innerHTML += "<span class=\"prompt-color\">" + this.completePrompt + "</span> " + command + "<br/>";
  };

  Terminal.prototype.init = function () {
    this.cmdLine.disabled = true;
    this.lock(); // Need to lock here since the sidenav elements were just added
    document.getElementById("terminal").addEventListener("click", function (event) {
      this.focus();
    }.bind(this));
    this.cmdLine.addEventListener("keydown", function (event) {
      if (event.which === 13 || event.keyCode === 13) {
        this.handleCmd();
        ignoreEvent(event);
      }
    }.bind(this));
    this.reset();
  };

  Terminal.makeElementDisappear = function (element) {
    element.style.opacity = 0;
    element.style.transform = "translateX(-300px)";
  };

  Terminal.makeElementAppear = function (element) {
    element.style.opacity = 1;
    element.style.transform = "translateX(0)";
  };

  Terminal.prototype.lock = function () {
    this.exec();
    this.cmdLine.blur();
    this.cmdLine.disabled = true;
  };

  Terminal.prototype.unlock = function (focus=true) {
    this.cmdLine.disabled = false;
    this.prompt.textContent = this.completePrompt;
    scrollToBottom();
    if (focus == true) {
      this.focus();
    }
  };

  Terminal.prototype.handleCmd = function () {
    var cmdComponents = this.cmdLine.value.trim().split(" ");
    this.lock();
    switch (cmdComponents[0]) {
      case cmds.HELP.value:
        this.help();
        break;
      case cmds.WHOAMI.value:
        this.whoami();
        break;
      case cmds.GETEMAIL.value:
        this.getemail();
        break;
      case cmds.GETSOCIAL.value:
        this.getsocial();
        break;
      case cmds.GETCV.value:
        this.getcv();
        break;
      default:
        this.invalidCommand(cmdComponents);
        break;
    };
  };

  Terminal.prototype.whoami = function (cmdComponents) {
    this.type("My name is Daniel\nTech-passionate DevOps engineer, defender of good practices.\nSystem and administration studies were how I first started getting into this world, and the more I learned, the more I became interested in automation and process integration. My professional career has been oriented towards DevOps methods, having worked from physical infrastructure to various public and private clouds.\nIn my projects I have designed and implemented both complete solutions from scratch, as well as the integration of new components into the existing system. It is my belief that good communication is key to the success of a project, as well as being able to work as a team.\nStriving to research new practices, technologies, and updates to existing ones in order to improve my work is a part of my routine. I'm a proactive person, who suggests improvements and changes, but who also understands business and / or time constraints.", this.unlock.bind(this));
  };

  Terminal.prototype.getemail = function (cmdComponents) {
    this.type("daniel.iniguez.cabrera@gmail.com", this.unlock.bind(this));
  };

  Terminal.prototype.getsocial = function (cmdComponents) {
    this.type("LinkedIn --> https://www.linkedin.com/in/daniel-iniguez-cabrera\nMalt --> https://www.malt.es/profile/danieliniguez\nGithub -->https://github.com/diniguezcabrera", this.unlock.bind(this));
  };

  Terminal.prototype.getcv = function (cmdComponents) {
    this.type("https://www.linkedin.com/in/daniel-iniguez-cabrera", this.unlock.bind(this));
  };


  Terminal.prototype.help = function () {
    var result = configs.getInstance().general_help + "\n\n";
    for (var cmd in cmds) {
      result += cmds[cmd].value + " - " + cmds[cmd].help + "\n";
    }
    this.type(result.trim(), this.unlock.bind(this));
  };

  Terminal.prototype.reset = function () {
    this.output.textContent = "";
    this.prompt.textContent = "";
    if (this.typeSimulator) {
      this.type(configs.getInstance().welcome + (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""), function () {
        this.unlock(focus=false);
      }.bind(this));
    }
  };

  Terminal.prototype.permissionDenied = function (cmdComponents) {
    this.type(configs.getInstance().permission_denied_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
  };

  Terminal.prototype.invalidCommand = function (cmdComponents) {
    this.type(configs.getInstance().invalid_command_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
  };

  Terminal.prototype.focus = function () {
    this.cmdLine.focus();
  };

  var TypeSimulator = function (timer, output) {
    var timer = parseInt(timer);
    if (timer === Number.NaN || timer < 0) {
      throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
    }
    if (!(output instanceof Node)) {
      throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
    }
    this.timer = timer;
    this.output = output;
  };

  TypeSimulator.prototype.type = function (text, callback) {
    if (isURL(text)) {
      window.open(text);
    }
    var i = 0;
    var output = this.output;
    var timer = this.timer;
    var skipped = false;
    var skip = function () {
      skipped = true;
    }.bind(this);
    document.getElementById("terminal").addEventListener("dblclick", skip);
    (function typer() {
      if (i < text.length) {
        var char = text.charAt(i);
        var isNewLine = char === "\n";
        output.innerHTML += isNewLine ? "<br/>" : char;
        i++;
        if (!skipped) {
          setTimeout(typer, isNewLine ? timer * 2 : timer);
        } else {
          output.innerHTML += (text.substring(i).replace(new RegExp("\n", 'g'), "<br/>")) + "<br/>";
          document.removeEventListener("dblclick", skip);
          callback();
        }
      } else if (callback) {
        output.innerHTML += "<br/>";
        document.removeEventListener("dblclick", skip);
        callback();
      }
      scrollToBottom();
    })();
  };

  return {
    listener: function () {
      new Terminal(
        document.getElementById("prompt"),
        document.getElementById("cmdline"),
        document.getElementById("output"),
        configs.getInstance().user,
        configs.getInstance().host,
        configs.getInstance().type_delay
      ).init();
    }
  };
})();

window.onload = main.listener;
