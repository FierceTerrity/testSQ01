import { TPlayerConnected, TPlayerWounded, TSquadCreated } from 'squad-logs';
import { EVENTS } from '../constants';
import { adminWarn } from '../core';
import { TPlayerRoleChanged, TPluginProps } from '../types';
import { getPlayerByEOSID, getPlayerByName } from './helpers';

export const warnPlayers: TPluginProps = (state) => {
  const { listener, execute } = state;
  let warningTimeout: NodeJS.Timeout;
  const messageAttacker = 'Убил своего !!! Извинись в чате.';
  const messageVictim = 'Вас убил союзный игрок.';

  const sendWarningMessages = (steamID: string, messages: string[]) => {
    for (const message of messages) {
      adminWarn(execute, steamID, message);
    }
  };

  const playerConnected = (data: TPlayerConnected) => {
    const { steamID } = data;
    const messages = [
      'Убедительная просьба ознакомиться с правилами сервера.',
      'Нарушение правил -> зачастую приводит к бану , на определённый срок',
    ];

    sendWarningMessages(steamID, messages);

    setTimeout(() => {
      sendWarningMessages(steamID, messages);
    }, 60000);
  };

  const squadCreated = (data: TSquadCreated) => {
    const { steamID } = data;
    if (warningTimeout) {
      clearTimeout(warningTimeout);
    }

    const messages = [     
      'Добро пожаловать на сервера -✯- Лучшие в Аду -✯-',
      'Discord:  -✯- discord.gg/bestinhell -✯-',
      'Убедительная просьба ознакомиться с правилами сервера.',
    ];

    sendWarningMessages(steamID, messages);

    warningTimeout = setTimeout(() => {
      sendWarningMessages(steamID, messages);
    }, 60000);
  };

  const playerRoleChanged = (data: TPlayerRoleChanged) => {
    const { role, steamID } = data.player;

    if (warningTimeout) {
      clearTimeout(warningTimeout);
    }

    const roleMessagesMap = new Map([
      ['Pilot', 'Перед управлением вертолётом , пройдите тренировку, намеренный руин или откровенное неумение пилотировать - карается баном!'],
      [
        'Crewman',
        'Передвижение на тяж. технике в одиночку и без Сквад лидера запрещено!',
      ],
    ]);

    for (const [checkRole, message] of roleMessagesMap) {
      if (role.includes(checkRole)) {
        adminWarn(execute, steamID, message);

        warningTimeout = setTimeout(() => {
          adminWarn(execute, steamID, message);
        }, 60000);
      }
    }
  };

  const playerWounded = ({ victimName, attackerEOSID }: TPlayerWounded) => {
    if (!victimName || !attackerEOSID) return;

    const victim = getPlayerByName(state, victimName);
    const attacker = getPlayerByEOSID(state, attackerEOSID);
    if (victim?.name === attacker?.name) return;
    if (victim && attacker && victim.teamID === attacker.teamID) {
      adminWarn(execute, victim.steamID, messageVictim + '\n' + attacker.name);
      adminWarn(execute, attacker.steamID, messageAttacker);
    }
  };

  listener.on(EVENTS.PLAYER_CONNECTED, playerConnected);
  listener.on(EVENTS.SQUAD_CREATED, squadCreated);
  listener.on(EVENTS.PLAYER_ROLE_CHANGED, playerRoleChanged);
  listener.on(EVENTS.PLAYER_WOUNDED, playerWounded);
};
