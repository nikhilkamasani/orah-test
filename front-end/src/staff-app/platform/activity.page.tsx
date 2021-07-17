import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "../../shared/hooks/use-api"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { CenteredContainer } from "../../shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Activity } from "../../shared/models/activity"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return <S.Container>
    {loadState === "loading" && (
      <CenteredContainer>
        <FontAwesomeIcon icon="spinner" size="2x" spin />
      </CenteredContainer>
    )}
    {loadState === "error" && (
      <CenteredContainer>
        <div>Failed to load</div>
      </CenteredContainer>
    )}
    {loadState === "loaded" && (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Present</TableCell>
              <TableCell>Absent</TableCell>
              <TableCell>Late</TableCell>
              <TableCell>Un Marked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.activity.map(a => (
              <TableRow key={a.entity.id}>
                <TableCell>{a.entity.name}</TableCell>
                <TableCell>{new Date(a.date).toDateString()}</TableCell>
                <TableCell>{a.entity.student_roll_states.filter(i => i.roll_state === "present").length}</TableCell>
                <TableCell>{a.entity.student_roll_states.filter(i => i.roll_state === "absent").length}</TableCell>
                <TableCell>{a.entity.student_roll_states.filter(i => i.roll_state === "late").length}</TableCell>
                <TableCell>{a.entity.student_roll_states.filter(i => i.roll_state === "unmark").length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
