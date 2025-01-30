import Head from 'next/head';
import MainLayout from '~/components/Layout/MainLayout';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { UserAvatar } from '~/components/ui/avatar';
import {
  Bell,
  ChevronRight,
  Download,
  DownloadCloud,
  FileDown,
  Github,
  HeartHandshakeIcon,
  Star,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { AppDrawer } from '~/components/ui/drawer';
import { SubmitFeedback } from '~/components/Account/SubmitFeedback';
import { UpdateDetails } from '~/components/Account/UpdateDetails';
import { api } from '~/utils/api';
import { type NextPageWithUser } from '~/types';
import { toast } from 'sonner';
import { env } from '~/env';
import { SubscribeNotification } from '~/components/Account/SubscribeNotification';
import { useState } from 'react';
import { LoadingSpinner } from '~/components/ui/spinner';

const AccountPage: NextPageWithUser = ({ user }) => {
  const userQuery = api.user.me.useQuery();
  const downloadQuery = api.user.downloadData.useMutation();

  const [downloading, setDownloading] = useState(false);

  async function downloadData() {
    setDownloading(true);
    const data = await downloadQuery.mutateAsync();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'splitpro_data.json';
    link.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  return (
    <>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout title="Account" header={<div className="text-3xl font-semibold">Account</div>}>
        <div className="mt-4 px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserAvatar user={user} size={50} />
              <div>
                <div className="text-xl font-semibold">{userQuery.data?.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <div>
              {!userQuery.isLoading ? (
                <UpdateDetails defaultName={userQuery.data?.name ?? ''} />
              ) : null}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <AppDrawer
              trigger={
                <div className="flex w-full justify-between px-0 py-2 text-[16px] font-medium text-gray-300 hover:text-foreground/80">
                  <div className="flex items-center gap-4">
                    <Download className="h-5 w-5 text-blue-500" />
                    Download App
                  </div>
                  <ChevronRight className="h-6x w-6 text-gray-500" />
                </div>
              }
              leftAction="Close"
              title="Download App"
              className="h-[70vh]"
              shouldCloseOnAction
            >
              <div className="flex flex-col gap-8">
                <p>You can download SplitPro as a PWA to your home screen</p>

                <p>
                  If you are using iOS, checkout this{' '}
                  <a
                    className="text-cyan-500 underline"
                    href="https://youtube.com/shorts/MQHeLOjr350"
                    target="_blank"
                  >
                    video
                  </a>
                </p>

                <p>
                  If you are using Android, checkout this{' '}
                  <a
                    className="text-cyan-500 underline"
                    href="https://youtube.com/shorts/04n7oKGzgOs"
                    target="_blank"
                  >
                    Video
                  </a>
                </p>
              </div>
            </AppDrawer>
          </div>

          <div className="mt-2 flex justify-center">
            <Button
              variant="ghost"
              className="text-orange-600 hover:text-orange-600/90 "
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

AccountPage.auth = true;

export default AccountPage;
