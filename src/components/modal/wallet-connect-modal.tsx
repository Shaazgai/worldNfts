// components/modal/wallet-connection-modal.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../provider/auth-context-provider";
// import { useAuth } from "@/contexts/WalletAuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ExtendedLayerType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllLayers } from "@/lib/service/queryHelper";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WalletConnectionModalProps {
  open: boolean;
  onClose: () => void;
  // layers: ExtendedLayerType[];
}

export function WalletConnectionModal({
  open,
  onClose,
  // layers,
}: WalletConnectionModalProps) {
  const [showLinkAlert, setShowLinkAlert] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<ExtendedLayerType | null>(
    null,
  );

  const {
    authState,
    setLayers,

    proceedWithLinking,
    connectWallet,
    disconnectWallet,
    isWalletConnected,
  } = useAuth();

  // Fetch layers using React Query
  const { data: layers = [] } = useQuery({
    queryKey: ["layerData"],
    queryFn: getAllLayers,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (layers.length > 0) {
      setLayers(layers);
    }
  }, [layers]);

  const getLayerImage = (layer: string) => {
    switch (layer) {
      case "BITCOIN":
        return "/wallets/Bitcoin.png";
      case "FRACTAL":
        return "/wallets/Fractal.png";
      case "CITREA":
        return "/wallets/Citrea.png";
      case "NUBIT":
        return "/wallets/nubit.webp";
      default:
        return "/wallets/Citrea.png";
    }
  };

  // const handleConnect = async (layerId: string, isSecondary = false) => {
  //   console.log("🚀 ~ handleConnect ~ layerId:", layerId);
  //   setSelectedLayerId(layerId);

  //   try {
  //     if (isSecondary) {
  //       await connectSecondary();
  //     } else {
  //       await connectPrimary();
  //     }
  //     toast.success(
  //       `${isSecondary ? "Secondary" : "Primary"} wallet connected successfully`,
  //     );
  //     onClose();
  //   } catch (error) {
  //     toast.error(`Failed to connect wallet. ${error}`);
  //   }
  // };

  const staticLayers: ExtendedLayerType[] = [
    {
      id: "static-1",
      layer: "NUBIT",
      name: "Nubit Testnet",
      network: "TESTNET",
      comingSoon: true,
    },
  ];

  const filteredLayers = [
    ...layers.filter(
      (layer: ExtendedLayerType) =>
        !(layer.layer === "BITCOIN" && layer.network === "TESTNET"),
    ),
    ...staticLayers,
  ];

  const handleConnection = async (layer: ExtendedLayerType) => {
    if (isWalletConnected(layer.id)) {
      try {
        await disconnectWallet(layer.id);
        toast.success(`Disconnected from ${layer.layer}`);
      } catch (error) {
        toast.error(`Failed to disconnect wallet. ${error}`);
      }
      return;
    }

    try {
      await connectWallet(layer.id, authState.authenticated);
      toast.success(
        `${authState.authenticated ? "Linked" : "Connected to"} ${layer.layer}`,
      );
    } catch (error) {
      if (error instanceof Error && error.message === "WALLET_ALREADY_LINKED") {
        setCurrentLayer(layer);
        setShowLinkAlert(true);
      } else {
        toast.error(
          `Failed to ${authState.authenticated ? "link" : "connect"} wallet. ${error}`,
        );
      }
    }
  };

  const handleProceedWithLinking = async () => {
    try {
      await proceedWithLinking();
      toast.success(`Successfully linked wallet`);
      setShowLinkAlert(false);
    } catch (error) {
      toast.error(`Failed to link wallet: ${error}`);
    }
  };

  //alert iin UI goy bolgoh
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-neutral500 border border-white4">
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-neutral00">
                Manage Wallets
              </h2>
              <p className="text-neutral50">
                Connect or disconnect your wallets for each network
              </p>
            </div>

            <div className="grid gap-4">
              {layers.map((layer: ExtendedLayerType) => {
                const connected = isWalletConnected(layer.id);

                return (
                  <Button
                    key={layer.id}
                    variant="outline"
                    className={`flex items-center justify-between p-4 ${
                      layer.comingSoon
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white8"
                    }`}
                    onClick={() => !layer.comingSoon && handleConnection(layer)}
                    disabled={layer.comingSoon || authState.loading}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={getLayerImage(layer.layer)}
                        alt={layer.layer}
                        width={32}
                        height={32}
                      />
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-neutral00">
                          {layer.layer}
                        </span>
                        <span className="text-sm text-neutral50">
                          {layer.network}
                        </span>
                      </div>
                    </div>
                    {layer.comingSoon ? (
                      <span className="text-xs bg-white8 px-2 py-1 rounded-full">
                        Soon
                      </span>
                    ) : authState.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : connected ? (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        Connected
                      </span>
                    ) : null}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 text-sm text-neutral50">
              <p>
                By connecting a wallet, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showLinkAlert} onOpenChange={setShowLinkAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wallet Already Linked</AlertDialogTitle>
            <AlertDialogDescription>
              This wallet is already linked to another account. Would you like
              to move it to your current account instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLinkAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedWithLinking}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
