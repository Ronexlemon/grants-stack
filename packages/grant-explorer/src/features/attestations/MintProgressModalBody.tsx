import { useState } from "react";
import { ProgressStatus } from "../../hooks/attestations/config";
import { useAccount, useBalance } from "wagmi";
import {
  ImpactMintingSuccess,
  PreviewFrameHistoryPage,
} from "./MintYourImpactComponents";
import { AttestationChainId } from "./utils/constants";
import { MintingProcessContent } from "./components/index";
import { useAttestationFee } from "../contributors/hooks/useMintingAttestations";

type MintProgressModalBodyProps = {
  handleSwitchChain: () => Promise<void>;
  handleAttest: () => Promise<void | string | undefined>;
  toggleStartAction?: () => void;
  selectBackground?: (background: string) => void;

  status: ProgressStatus;
  isLoading: boolean;
  impactImageCid?: string;
  gasEstimation: bigint | undefined;
  notEnoughFunds: boolean;
  isLoadingEstimation: boolean;
  isTransactionHistoryPage?: boolean;
  previewBackground?: string;
  selectedColor?: string;
  attestationFee: bigint;
  heading?: string;
  subheading?: string;
};

// MintProgressModalBodyThankYou component
export function MintProgressModalBodyThankYou(
  props: MintProgressModalBodyProps
) {
  const {
    handleSwitchChain,
    status,
    gasEstimation,
    isLoadingEstimation,
    notEnoughFunds,
    handleAttest,
    isLoading,
    heading,
    subheading,
  } = props;

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    chainId: AttestationChainId,
    address,
  });
  const { data: attestationFee } = useAttestationFee();

  return (
    <div
      className={`w-[450px] min-h-full flex flex-col justify-center text-black p-6 gap-8`}
    >
      <div className={`flex flex-col gap-2`}>
        <div className={`text-3xl/[34px] font-modern-era-bold`}>{heading}</div>
        <div className={`text-[16px]/[26px] font-modern-era-regular`}>
          {subheading}
        </div>
      </div>
      <MintingProcessContent
        status={status}
        balance={balance?.value}
        notEnoughFunds={notEnoughFunds}
        isLoadingEstimation={isLoadingEstimation}
        gasEstimation={gasEstimation}
        isConnected={isConnected}
        attestationFee={attestationFee}
        handleSwitchChain={handleSwitchChain}
        handleAttest={handleAttest}
        isLoading={isLoading}
      />
    </div>
  );
}

// MintProgressModalBodyHistory component
export function MintProgressModalBodyHistory(
  props: MintProgressModalBodyProps
) {
  const {
    attestationFee,
    handleSwitchChain,
    status,
    gasEstimation,
    isLoadingEstimation,
    notEnoughFunds,
    handleAttest,
    toggleStartAction,
    isLoading,
    selectBackground,
    selectedColor,
    previewBackground,
    impactImageCid,
    heading,
    subheading,
  } = props;

  const [attestationLink, setAttestationLink] = useState<string | undefined>(
    undefined
  );

  const attest = async () => {
    setAttestationLink((await handleAttest()) as string);
  };

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    chainId: AttestationChainId,
    address,
  });

  const isOnAction =
    status !== ProgressStatus.SELECTING_COLOR &&
    status !== ProgressStatus.IS_SUCCESS;

  return (
    <div
      className={`min-w-full max-w-[710px] min-h-full flex flex-col justify-center text-black ${!isOnAction ? "p-10 items-center text-center gap-6" : "p-6 gap-8"}`}
    >
      <div className={`flex flex-col ${isOnAction ? "gap-2" : "gap-6"}`}>
        <div
          className={`${isOnAction ? "text-3xl/[34px]" : "text-5xl/[39px]"} font-modern-era-bold`}
        >
          {heading}
        </div>
        <div
          className={`${isOnAction ? "text-[16px]/[26px]" : "text-[20px]/[26px]"} font-modern-era-regular`}
        >
          {subheading}
        </div>
      </div>
      {status === ProgressStatus.SELECTING_COLOR ? (
        <PreviewFrameHistoryPage
          selectBackground={selectBackground as () => void}
          nextStep={() => {
            toggleStartAction?.();
          }}
          previewBackground={previewBackground as string}
          selectedColor={selectedColor as string}
        />
      ) : status === ProgressStatus.IS_SUCCESS ? (
        <ImpactMintingSuccess
          impactImageCid={impactImageCid as string}
          attestationLink={attestationLink ?? ""}
          isShareButtonsAbove={false}
        />
      ) : (
        <MintingProcessContent
          status={status}
          balance={balance?.value}
          notEnoughFunds={notEnoughFunds}
          isLoadingEstimation={isLoadingEstimation}
          gasEstimation={gasEstimation}
          isConnected={isConnected}
          handleSwitchChain={handleSwitchChain}
          handleAttest={attest}
          isLoading={isLoading}
          attestationFee={attestationFee}
        />
      )}
    </div>
  );
}