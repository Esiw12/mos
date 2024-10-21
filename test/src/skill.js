import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Skills = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 1200;
    const height = 1200;
    const innerRadius = 300; 
    const outerRadius = 550; 

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    svg.selectAll("*").remove(); 

    const angleScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, 2 * Math.PI]);

    const skillPositions = {}; 
    const competencePositions = {}; 

    const innerCircleLines = svg.append("g")
      .attr("class", "inner-circle-lines");

    const competenceGroup = svg.append("g")
      .selectAll(".competence")
      .data(data)
      .enter().append("g")
      .attr("class", "competence")
      .attr("transform", (d, i) => {
        const angle = angleScale(i);
        const x = Math.cos(angle) * innerRadius;
        const y = Math.sin(angle) * innerRadius;
        competencePositions[d.name] = { x, y }; 
        return `translate(${x},${y})`;
      })
      .on("click", handleCompetenceClick); 

    competenceGroup.append("circle")
      .attr("r", 20)
      .attr("fill", "lightgray");

    competenceGroup.append("text")
      .text(d => d.name)
      .attr("dy", -30)
      .style("text-anchor", "middle");

    data.forEach((d, i) => {
      const nextIndex = (i + 1) % data.length; 
      const nextCompetence = data[nextIndex];
      innerCircleLines.append("line")
        .attr("x1", competencePositions[d.name].x)
        .attr("y1", competencePositions[d.name].y)
        .attr("x2", competencePositions[nextCompetence.name].x)
        .attr("y2", competencePositions[nextCompetence.name].y)
        .attr("stroke", "#d3d3d3") 
        .attr("stroke-width", 2);
    });

    const outerCircleLines = svg.append("g")
      .attr("class", "outer-circle-lines");

    const allSkills = new Set();
    data.forEach(d => {
      d.mainSkills.forEach(skill => allSkills.add(skill));
      d.otherSkills.forEach(skill => allSkills.add(skill));
    });

    const skillsArray = Array.from(allSkills);
    const skillAngleStep = 2 * Math.PI / skillsArray.length; 

    const skillGroup = svg.append("g")
      .selectAll(".skill")
      .data(skillsArray)
      .enter().append("g")
      .attr("class", "skill")
      .attr("transform", (skill, index) => {
        const angle = index * skillAngleStep;
        const x = Math.cos(angle) * outerRadius;
        const y = Math.sin(angle) * outerRadius;
        skillPositions[skill] = { x, y }; 
        return `translate(${x},${y})`;
      }).on("click", (event, skill) => handleSkillClick(skill));;

    skillGroup.append("circle")
      .attr("r", 10)
      .attr("fill", "orange");

    skillGroup.append("text")
      .text(skill => skill)
      .attr("dy", -15)
      .style("text-anchor", "middle");

    skillsArray.forEach((skill, index) => {
      const nextIndex = (index + 1) % skillsArray.length; 
      const nextSkill = skillsArray[nextIndex];
      outerCircleLines.append("line")
        .attr("x1", skillPositions[skill].x)
        .attr("y1", skillPositions[skill].y)
        .attr("x2", skillPositions[nextSkill].x)
        .attr("y2", skillPositions[nextSkill].y)
        .attr("stroke", "#d3d3d3") 
        .attr("stroke-width", 2);
    });

   
    function handleCompetenceClick(event, d) {
      svg.selectAll(".line-main, .line-other").remove(); 

      d.mainSkills.forEach(skill => {
        svg.append("line")
          .attr("class", "line-main")
          .attr("x1", competencePositions[d.name].x)
          .attr("y1", competencePositions[d.name].y)
          .attr("x2", skillPositions[skill].x)
          .attr("y2", skillPositions[skill].y)
          .attr("stroke", "orange")
          .attr("stroke-width", 2)
          .attr("opacity", 0)
          .transition()
          .duration(500)
          .attr("opacity", 1);
      });

      d.otherSkills.forEach(skill => {
        svg.append("line")
          .attr("class", "line-other")
          .attr("x1", competencePositions[d.name].x)
          .attr("y1", competencePositions[d.name].y)
          .attr("x2", skillPositions[skill].x)
          .attr("y2", skillPositions[skill].y)
          .attr("stroke", "purple")
          .attr("stroke-width", 2)
          .attr("opacity", 0)
          .transition()
          .duration(500)
          .attr("opacity", 1);
      });
    }

    function handleSkillClick(skill) {
      svg.selectAll(".line-main, .line-other").remove(); 


      data.forEach(d => {
        if (d.mainSkills.includes(skill)) {
          svg.append("line")
            .attr("class", "line-main")
            .attr("x1", competencePositions[d.name].x)
            .attr("y1", competencePositions[d.name].y)
            .attr("x2", skillPositions[skill].x)
            .attr("y2", skillPositions[skill].y)
            .attr("stroke", "orange")
            .attr("stroke-width", 2)
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .attr("opacity", 1);
        }

        if (d.otherSkills.includes(skill)) {
          svg.append("line")
            .attr("class", "line-other")
            .attr("x1", competencePositions[d.name].x)
            .attr("y1", competencePositions[d.name].y)
            .attr("x2", skillPositions[skill].x)
            .attr("y2", skillPositions[skill].y)
            .attr("stroke", "purple")
            .attr("stroke-width", 2)
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .attr("opacity", 1);
        }
      });
    }
  }, [data]);

  return (
    <svg ref={svgRef} width={1200} height={1200}></svg>
  );
};

export default Skills;
