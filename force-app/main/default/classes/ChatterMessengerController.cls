public with sharing class ChatterMessengerController {
    @AuraEnabled(cacheable=true)
    public static List<Conversation> getConversations() {
        ConnectApi.ChatterConversationPage page = ConnectApi.ChatterMessages.getConversations();
        List<Conversation> result = new List<Conversation>();
        for (ConnectApi.ChatterConversationSummary conv : page.conversations) {
            result.add(new Conversation(conv));
        }
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<Message> getConversation(String convId) {
        if (String.isBlank(convId)) {
            return new List<Message>();
        }
        ConnectApi.ChatterConversation page = ConnectApi.ChatterMessages.getConversation(
            convId
        );
        List<Message> result = new List<Message>();
        for (ConnectApi.ChatterMessage msg : page.messages.messages) {
            result.add(new Message(msg));
        }
        return result;
    }

    @AuraEnabled
    public static Message replyToMessage(String text, String msgId) {
        ConnectApi.ChatterMessage msg = ConnectApi.ChatterMessages.replyToMessage(
            text,
            msgId
        );
        return new Message(msg);
    }

    @AuraEnabled
    public static Message sendMessage(String text, String recipients) {
        ConnectApi.ChatterMessage msg = ConnectApi.ChatterMessages.sendMessage(
            text,
            recipients
        );
        return new Message(msg);
    }

    @AuraEnabled(cacheable=true)
    public static List<User> searchUsers(String query) {
        ConnectApi.UserPage users = ConnectApi.ChatterUsers.searchUsers(
            null,
            query
        );
        List<User> result = new List<User>();
        for (ConnectApi.UserDetail user : users.users) {
            if (UserInfo.getUserId() != user.id) {
                result.add(new User(user));
            }
        }
        return result;
    }

    @AuraEnabled
    public static void publishNewMessageEvent(
        String conversationId,
        String messageId
    ) {
        EventBus.publish(
            new ChatterMessageEvent__e(
                conversationId__c = conversationId,
                messageId__c = messageId
            )
        );
    }
	
    public class User {
        
        public String id { get; private set; }
        
        String name { get; set; }
        
        String smallPhotoUrl { get; set; }
        
        String companyName { get; set; }
        
        String title { get; set; }

        public User(ConnectApi.User user) {
            this.id = user.id;
            this.name = user.displayName;
            this.smallPhotoUrl = user.photo.smallPhotoUrl;
            this.companyName = user.companyName;
            this.title = user.title;
        }
    }

    public class Conversation {
        
        String id { get; set; }
        
        String formattedRecipientNames { get; set; }
        
        Datetime sentDate { get; set; }
        
        String message { get; set; }
        
        String smallPhotoUrl { get; set; }
        
        String latestMessageId { get; set; }

        public Conversation(ConnectApi.ChatterConversationSummary conv) {
            this.id = conv.id;
            this.sentDate = conv.latestMessage.sentDate;
            this.message = conv.latestMessage.body.text;
            this.smallPhotoUrl = conv.latestMessage.sender.photo.smallPhotoUrl;
            this.latestMessageId = conv.latestMessage.id;
            this.formattedRecipientNames = '';
            for (ConnectApi.UserSummary user : conv.members) {
                if (UserInfo.getUserId() != user.id) {
                    this.formattedRecipientNames += user.displayName + ', ';
                }
            }
            this.formattedRecipientNames = this
                .formattedRecipientNames.removeEnd(', ');
        }
    }

    public class Message {
        Datetime sentDate { get; set; }
        @AuraEnabled
        public String id { get; private set; }
        @AuraEnabled
        public String conversationId { get; private set; }
        
        String sender { get; set; }
        
        String formattedSentDate { get; set; }
        
        String text { get; set; }
        
        String smallPhotoUrl { get; set; }
        
        Boolean isMine { get; set; }
        
        List<String> recipients { get; set; }

        public Message(ConnectApi.ChatterMessage msg) {
            this.id = msg.id;
            this.conversationId = msg.conversationId;
            this.sender = msg.sender.name;
            this.sentDate = msg.sentDate;
            this.formattedSentDate = msg.sentDate.format();
            this.text = msg.body.text;
            this.smallPhotoUrl = msg.sender.photo.smallPhotoUrl;
            this.isMine = (UserInfo.getUserId() == msg.sender.id);

            this.recipients = new List<String>();
            if (!msg.recipients.isEmpty()) {
                for (ConnectApi.UserSummary recipient : msg.recipients) {
                    this.recipients.add(recipient.id);
                }
            }
        }
    }
}