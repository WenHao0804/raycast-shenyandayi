import { List } from "@raycast/api";
import { ModeType } from "../types";

export function ModeDropdown(props: { modeTypes: ModeType[]; onModeTypeChange: (newValue: string) => void }) {
  const { modeTypes, onModeTypeChange } = props;
  return (
    <List.Dropdown
      tooltip="Select Mode Type"
      storeValue={true}
      onChange={(newValue) => {
        onModeTypeChange(newValue);
      }}
    >
      <List.Dropdown.Section title="词还是句">
        {modeTypes.map((drinkType) => (
          <List.Dropdown.Item key={drinkType.id} title={drinkType.name} value={drinkType.id} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}