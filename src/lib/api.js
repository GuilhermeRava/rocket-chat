import { formatDistance } from 'date-fns';

import { getDateFnsLocale } from './locale';

export const normalizeAgent = (agentData) => agentData && { name: agentData.name, username: agentData.username, status: agentData.status };

export const normalizeQueueAlert = (queueInfo) => {
	if (!queueInfo) {
		return;
	}

	const { spot, estimatedWaitTimeSeconds } = queueInfo;
	const locale = getDateFnsLocale();
	const estimatedWaitTime = estimatedWaitTimeSeconds && formatDistance(new Date().setSeconds(estimatedWaitTimeSeconds), new Date(), { locale });
	return spot > 0
	&& (
		estimatedWaitTime
			? ('Your spot is #%{spot} (Estimated wait time: %{estimatedWaitTime})', { spot, estimatedWaitTime })
			: ('Your spot is #%{spot}', { spot })
	);
};
