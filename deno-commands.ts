

export const getOutputString = (output: any) => {
    const untrimmed_output = new TextDecoder().decode(
        output["stdout"],
    );
    const output_string = untrimmed_output.trim();
    return output_string;
};

export const run_command = async (
    command_string: string,
    _args: string[],
) => {
    const subpro = new Deno.Command(command_string, { args: _args });
    const output = await subpro.output();
    return output;
};