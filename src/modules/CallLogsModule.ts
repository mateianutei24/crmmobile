import { NativeModules } from 'react-native';

export interface CallLogItem {
  phoneNumber: string;
  name: string | null;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'REJECTED' | 'UNKNOWN';
  date: number;
  duration: number;
}

export interface TopContact {
  name: string;
  phoneNumber: string;
  totalDuration: number;
  callCount: number;
}

interface CallLogsModuleInterface {
  getCallLogs(limit: number): Promise<CallLogItem[]>;
  getTopContactsByDuration(limit: number): Promise<TopContact[]>;
}

const { CallLogsModule } = NativeModules;

export default CallLogsModule as CallLogsModuleInterface;