import { component$, Signal, Slot } from "@builder.io/qwik";
import { Modal } from "@kunai-consulting/kunai-design-system";

export interface CopyComponentsModalProps {
  openSignal: Signal<boolean>;
}

export const CopyComponentsModal = component$<CopyComponentsModalProps>(
  ({ openSignal }) => {
    return (
      <Modal.Root bind:show={openSignal}>
        <Modal.Panel class="m-auto">
          <Modal.Close>Close</Modal.Close>
          <Modal.Title>Dialog Header</Modal.Title>
          <Modal.Description>Description</Modal.Description>
          <Slot />
        </Modal.Panel>
      </Modal.Root>
    );
  },
);
