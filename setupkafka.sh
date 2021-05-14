for TOPIC in reddit-user-topic reddit-auth-topic reddit-post-topic reddit-community-topic reddit-post-vote-topic reddit-comment-vote-topic reddit-chat-topic reddit-testing-topic reddit-invitation-topic response_topic; do
  kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic $TOPIC
done
