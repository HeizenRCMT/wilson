import { createMiddleware, Formatter } from 'seyfert';
import { TimestampStyle } from 'seyfert/lib/common';

export default createMiddleware<void>(async ({ context, next, stop }) => {
  const inCooldown = context.client.cooldown.context(context);

  typeof inCooldown === 'number'
    ? stop(
        `Tienes que esperar: ${Formatter.timestamp(new Date(Date.now() + inCooldown), TimestampStyle.RelativeTime)} espera un poco para hacerlo nuevamente.`,
      )
    : next();
});