let members = [];

function loadDefaultMembers() {
    members = [
        {"name": "Alice", "gender": "F", "availability": [true, true, true, true, true, true]},
        {"name": "Bob", "gender": "M", "availability": [true, true, true, true, true, true]},
        {"name": "Charlie", "gender": "M", "availability": [true, true, true, true, true, true]},
        {"name": "David", "gender": "M", "availability": [true, true, true, true, true, true]},
        {"name": "Eve", "gender": "F", "availability": [true, true, true, true, true, true]},
        {"name": "Frank", "gender": "M", "availability": [true, true, true, true, true, true]},
        {"name": "Grace", "gender": "F", "availability": [true, true, true, true, true, true]},
        {"name": "Henry", "gender": "M", "availability": [true, true, true, true, true, true]},
        {"name": "Ivy", "gender": "F", "availability": [true, true, true, true, true, true]},
        {"name": "Jack", "gender": "M", "availability": [true, true, true, true, true, true]}
    ];
    renderMembers();
}

function renderMembers() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';
    members.forEach((member, index) => {
        const memberDiv = document.createElement('div');
        memberDiv.innerHTML = `
            <input type="text" value="${member.name}" onchange="updateMember(${index}, 'name', this.value)">
            <select onchange="updateMember(${index}, 'gender', this.value)">
                <option value="M" ${member.gender === 'M' ? 'selected' : ''}>Male</option>
                <option value="F" ${member.gender === 'F' ? 'selected' : ''}>Female</option>
            </select>
            ${member.availability.map((available, round) => `
                <input type="checkbox" ${available ? 'checked' : ''} onchange="updateAvailability(${index}, ${round}, this.checked)">R${round + 1}
            `).join('')}
            <button onclick="removeMember(${index})">Remove</button>
        `;
        membersList.appendChild(memberDiv);
    });
}

function updateMember(index, field, value) {
    members[index][field] = value;
}

function updateAvailability(memberIndex, round, available) {
    members[memberIndex].availability[round] = available;
}

function addMember() {
    members.push({
        name: '',
        gender: 'M',
        availability: [true, true, true, true, true, true]
    });
    renderMembers();
}

function removeMember(index) {
    members.splice(index, 1);
    renderMembers();
}

function generateSchedule() {
    const schedule = generate_schedule(members);
    renderSchedule(schedule);
}

function generate_schedule(players) {
    const schedule = {};
    for (let i = 1; i <= 6; i++) {
        schedule[i] = {1: [], 2: []};
    }
    let women_doubles_played = false;

    for (let round_num = 1; round_num <= 6; round_num++) {
        let available_players = players.filter(p => p.availability[round_num-1]);
        shuffleArray(available_players);
        
        if (available_players.length < 8) {
            console.log(`라운드 ${round_num}: 충분한 플레이어가 없습니다. 가능한 만큼 배정합니다.`);
        }
        
        let women = available_players.filter(p => p.gender === 'F');
        
        if (!women_doubles_played && women.length >= 4) {
            let women_match = women.slice(0, 4);
            let court = Math.random() < 0.5 ? 1 : 2;
            schedule[round_num][court] = women_match;
            women_match.forEach(player => {
                available_players = available_players.filter(p => p !== player);
            });
            women_doubles_played = true;
        }
        
        for (let court = 1; court <= 2; court++) {
            if (!schedule[round_num][court].length && available_players.length >= 4) {
                let match = available_players.slice(0, 4);
                schedule[round_num][court] = match;
                match.forEach(player => {
                    available_players = available_players.filter(p => p !== player);
                });
            }
        }
    }
    
    if (!women_doubles_played) {
        for (let round_num = 6; round_num >= 1; round_num--) {
            let available_women = players.filter(p => p.gender === 'F' && p.availability[round_num-1]);
            if (available_women.length >= 4) {
                let women_match = available_women.slice(0, 4);
                let court = Math.random() < 0.5 ? 1 : 2;
                schedule[round_num][court] = women_match;
                women_doubles_played = true;
                break;
            }
        }
    }
    
    if (!women_doubles_played) {
        console.log("경고: 여성 복식 경기를 배정할 수 없었습니다.");
    }

    return schedule;
}

function renderSchedule(schedule) {
    const scheduleDiv = document.getElementById('schedule');
    let tableHTML = '<table><tr><th>Round</th><th>Court 1</th><th>Court 2</th></tr>';
    
    for (let round = 1; round <= 6; round++) {
        tableHTML += `<tr><td>${round}</td>`;
        for (let court = 1; court <= 2; court++) {
            const players = schedule[round][court];
            const cellClass = getCellClass(players);
            const playerNames = players.map(p => `${p.name} (${p.gender})`).join(', ');
            tableHTML += `<td class="${cellClass}">${playerNames || 'No game scheduled'}</td>`;
        }
        tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    scheduleDiv.innerHTML = tableHTML;
}

function getCellClass(players) {
    if (players.length === 0) return '';
    if (players.every(p => p.gender === 'M')) return 'men-doubles';
    if (players.every(p => p.gender === 'F')) return 'women-doubles';
    return 'mixed-doubles';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.addEventListener('DOMContentLoaded', loadDefaultMembers);