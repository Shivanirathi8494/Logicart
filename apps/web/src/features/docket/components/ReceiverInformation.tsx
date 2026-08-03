import PartyInformation from "./PartyInformation";

export default function ReceiverInformation(props: any) {
  return (
    <PartyInformation
      {...props}
      title="Receiver Information"
      type="receiver"
    />
  );
}
