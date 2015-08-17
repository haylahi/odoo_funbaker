openerp.chat_notifications = function(instance) {
	var module = instance.im_chat;
	var notification = window.Notification || window.mozNotification || window.webkitNotification;
	if (notification) {
		notification.requestPermission();
		if (notification.permission != 'granted') {
			return;
		}
	}
	else {
		return;
	}

	module.Conversation.include({
		received_message: function(message) {
			//gather all necessary data
			var from = message.from_id[1];
			var from_id = message.from_id[0];
			var to_id = message.to_id[0];
			var text = message.message;
			var icon = openerp.session.url(_.str.sprintf("/im_chat/image/%s/%s", this.get('session').uuid, message.from_id[0]));
			var id  = message.id;
			
			//my own message
			if (from_id == openerp.session.user_context.uid) {
				this._super(message);
				return false;
			}
			
			//create notification
			var notif = new notification(from, {
				'body': text,
				'icon': icon,
				'tag': id,
				'sticky': true
			});
			
			//switch to browser window/tab if possible
			notif.onclick = function() {
				window.focus();
			}
			
			//pass the message to im_chat
			this._super(message);
		},
	});
}
