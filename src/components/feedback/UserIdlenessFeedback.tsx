import * as React from "react";
import { useIdleTimer } from "react-idle-timer";

import { styled } from "@/lib/index";
import { CustomActionCard } from "@/components/card/CustomActionCard";
import AppCustomModal from "@/components/modal/Modal";
import { useUserStore } from "@/config/store-config/store.config";

const timeout = 600_000; // 10 minutes Idle Time
const promptBeforeIdle = 60_000; // 1 Minute logout prompt;

export default function UserIdlenessFeedback() {
  const { logout } = useUserStore((state) => state);
  const [remaining, setRemaining] = React.useState<number>(timeout);
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const onIdle = () => {
    setShowModal(false);
  };

  const onActive = () => {
    setShowModal(false);
  };

  const onPrompt = () => {
    setShowModal(true);
  };

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStillHere = () => {
    activate();
  };

  if (remaining === 0) {
    //  Logout User
    logout();
  }

  return (
    <>
      <AppCustomModal
        handleClose={handleCloseModal}
        open={showModal}
        alignTitle="left"
        closeOnOutsideClick={false}
        showClose={false}
        title={""}>
        <CustomActionCard
          buttonAction={handleStillHere}
          showIcon={false}
          buttonText="Keep me Logged in"
          message={
            <LogoutInfo>
              <span>
                We discovered you have been inactive for over 10 minutes now.
                You will now be logged out in
              </span>
              <span className="timer">{remaining}s</span>
            </LogoutInfo>
          }
          title="Are you still here?"
          // isSubmitting={isSubmitting}
        />
      </AppCustomModal>
    </>
  );
}

const LogoutInfo = styled.span`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: auto;
  /* max-width: 200px; */
  text-align: center;

  & .timer {
    font-size: 24px;
    font-weight: bold;
    font-family: "Poppins";
    width: fit-content;
    margin: auto;
    text-align: center;
    color: tomato;
  }
`;
