import { SystemSetting } from './setting.model';
import { AuditLog } from '../audit/audit.model';
import type { ISystemSetting } from './setting.interface';
import type { AuthUser } from '../../middlewares/auth.middleware';

export const getSystemSettingsService = async () => {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create({});
  }
  return settings;
};

export const updateSystemSettingsService = async (
  payload: Partial<ISystemSetting>,
  currentUser: AuthUser,
  logoUrl?: string
) => {
  let settings = await SystemSetting.findOne();

  const updateData = {
    ...payload,
    ...(logoUrl ? { logoUrl } : {}),
  };

  if (!settings) {
    settings = await SystemSetting.create(updateData);
  } else {
    settings = await SystemSetting.findByIdAndUpdate(settings._id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // Audit Log
  await AuditLog.create({
    actor: currentUser.userId,
    actorRole: currentUser.role,
    action: 'UPDATE_SYSTEM_SETTINGS',
    entity: 'SystemSetting',
    entityId: settings?._id.toString(),
    details: { updatedFields: Object.keys(updateData) },
  });

  return settings;
};
