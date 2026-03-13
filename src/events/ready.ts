import { createEvent } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(user, client) {
        client.logger.info(`Bot Online (${user.username})`);
    }
});