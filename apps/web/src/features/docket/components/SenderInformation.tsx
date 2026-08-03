import PartyInformation from "./PartyInformation";

export default function SenderInformation(props: any) {
  return (
    <PartyInformation
      {...props}
      title="Sender Information"
      type="sender"
    />
  );
}
